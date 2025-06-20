using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Audio;
using OpenAI.Chat;
using AudioAnalysis.Models;
using Newtonsoft.Json;

namespace AudioAnalysis.Services
{
    public class OpenAIService
    {
        private readonly OpenAIClient _client;

        public OpenAIService(IConfiguration configuration)
        {
            var apiKey = configuration["OpenAI:ApiKey"] 
                ?? throw new ArgumentNullException("OpenAI API key not found in configuration");
            _client = new OpenAIClient(apiKey);
        }

        public async Task<string> TranscribeAudioAsync(string audioFilePath)
        {
            try
            {
                var request = new AudioTranscriptionRequest(audioFilePath);
                var response = await _client.AudioEndpoint.CreateTranscriptionTextAsync(request);
                return response ?? string.Empty;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error transcribing audio: {ex.Message}");
            }
        }

        public async Task<string> GenerateSummaryAsync(string transcription)
        {
            try
            {
                var prompt = $"Please provide a concise summary of the following transcript:\n\n{transcription}\n\nSummary:";

                var chatRequest = new ChatRequest(
                    messages: new List<Message>
                    {
                        new Message(Role.System, "You are a helpful assistant that creates clear, concise summaries of audio transcripts."),
                        new Message(Role.User, prompt)
                    },
                    model: "gpt-4.1-mini"
                );

                var response = await _client.ChatEndpoint.GetCompletionAsync(chatRequest);
                return response.Choices[0].Message.Content.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error generating summary: {ex.Message}");
            }
        }

        public async Task<AnalysisResult> AnalyzeTranscriptAsync(string transcription, double audioDurationMinutes)
        {
            try
            {
                var prompt = $@"Analyze the following transcript and provide analytics in JSON format:

Transcript:
{transcription}

Audio Duration: {audioDurationMinutes:F2} minutes

Please provide the following analytics in JSON format:
1. Word count (total words in the transcript)
2. Speaking speed in words per minute (word count / duration in minutes)
3. Top 3+ frequently mentioned topics with their mention counts

Return only valid JSON in this exact format:
{{
  ""word_count"": 1234,
  ""speaking_speed_wpm"": 150.5,
  ""frequently_mentioned_topics"": [
    {{ ""topic"": ""Topic Name"", ""mentions"": 5 }},
    {{ ""topic"": ""Another Topic"", ""mentions"": 3 }}
  ]
}}";

                var chatRequest = new ChatRequest(
                    messages: new List<Message>
                    {
                        new Message(Role.System, "You are a helpful assistant that analyzes transcripts and returns analytics in JSON format. Always return valid JSON."),
                        new Message(Role.User, prompt)
                    },
                    model: "gpt-4.1-mini"
                );

                var response = await _client.ChatEndpoint.GetCompletionAsync(chatRequest);
                var content = response.Choices[0].Message.Content.ToString();

                // Extract JSON by finding the first { and last }
                int startIndex = content.IndexOf('{');
                int endIndex = content.LastIndexOf('}');
                if (startIndex == -1 || endIndex == -1)
                {
                    throw new Exception("Response does not contain valid JSON");
                }
                string cleanedContent = content.Substring(startIndex, endIndex - startIndex + 1);

                try
                {
                    var result = JsonConvert.DeserializeObject<AnalysisResult>(cleanedContent);
                    if (result == null)
                        throw new Exception("Deserialized object is null");
                    return result;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("\n--- RAW OPENAI RESPONSE ---\n" + content + "\n--------------------------\n");
                    throw new Exception($"Failed to parse OpenAI response: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error analyzing transcript: {ex.Message}");
            }
        }
    }
} 
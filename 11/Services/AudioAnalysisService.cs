using AudioAnalysis.Models;
using AudioAnalysis.Services;
using Newtonsoft.Json;

namespace AudioAnalysis.Services
{
    public class AudioAnalysisService
    {
        private readonly OpenAIService _openAIService;

        public AudioAnalysisService(OpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        public async Task<(string transcription, string summary, AnalysisResult analysis)> ProcessAudioFileAsync(string audioFilePath)
        {
            try
            {
                Console.WriteLine("Transcribing audio file...");
                var transcription = await _openAIService.TranscribeAudioAsync(audioFilePath);
                Console.WriteLine("✓ Transcription completed");

                Console.WriteLine("Generating summary...");
                var summary = await _openAIService.GenerateSummaryAsync(transcription);
                Console.WriteLine("✓ Summary generated");

                Console.WriteLine("Analyzing transcript...");
                // Estimate audio duration (this is a rough estimate - in a real app you'd get actual duration)
                var estimatedDurationMinutes = EstimateAudioDuration(transcription);
                var analysis = await _openAIService.AnalyzeTranscriptAsync(transcription, estimatedDurationMinutes);
                Console.WriteLine("✓ Analysis completed");

                return (transcription, summary, analysis);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error processing audio file: {ex.Message}");
            }
        }

        public async Task SaveResultsAsync(string transcription, string summary, AnalysisResult analysis, string baseFileName)
        {
            try
            {
                var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
                var outputDir = "outputs";
                
                // Create outputs directory if it doesn't exist
                if (!Directory.Exists(outputDir))
                {
                    Directory.CreateDirectory(outputDir);
                }

                // Save transcription
                var transcriptionFile = Path.Combine(outputDir, $"{baseFileName}_transcription_{timestamp}.md");
                await File.WriteAllTextAsync(transcriptionFile, transcription);
                Console.WriteLine($"✓ Transcription saved to: {transcriptionFile}");

                // Save summary
                var summaryFile = Path.Combine(outputDir, $"{baseFileName}_summary_{timestamp}.md");
                await File.WriteAllTextAsync(summaryFile, summary);
                Console.WriteLine($"✓ Summary saved to: {summaryFile}");

                // Save analysis
                var analysisFile = Path.Combine(outputDir, $"{baseFileName}_analysis_{timestamp}.json");
                var analysisJson = JsonConvert.SerializeObject(analysis, Formatting.Indented);
                await File.WriteAllTextAsync(analysisFile, analysisJson);
                Console.WriteLine($"✓ Analysis saved to: {analysisFile}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error saving results: {ex.Message}");
            }
        }

        public void DisplayResults(string summary, AnalysisResult analysis)
        {
            Console.WriteLine("\n" + new string('=', 60));
            Console.WriteLine("SUMMARY");
            Console.WriteLine(new string('=', 60));
            Console.WriteLine(summary);
            
            Console.WriteLine("\n" + new string('=', 60));
            Console.WriteLine("ANALYTICS");
            Console.WriteLine(new string('=', 60));
            Console.WriteLine($"Word Count: {analysis.WordCount}");
            Console.WriteLine($"Speaking Speed: {analysis.SpeakingSpeedWpm:F1} words per minute");
            
            Console.WriteLine("\nFrequently Mentioned Topics:");
            foreach (var topic in analysis.FrequentlyMentionedTopics)
            {
                Console.WriteLine($"  • {topic.Topic}: {topic.Mentions} mentions");
            }
            
            Console.WriteLine(new string('=', 60));
        }

        private double EstimateAudioDuration(string transcription)
        {
            // Rough estimate: average speaking speed is 150 words per minute
            // This is a simplified approach - in a real application you'd get actual audio duration
            var wordCount = transcription.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
            return wordCount / 150.0; // minutes
        }
    }
} 
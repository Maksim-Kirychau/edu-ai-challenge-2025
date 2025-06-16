using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;
using ServiceAnalysis.Models;

namespace ServiceAnalysis.Services;

public class OpenAIService
{
    private readonly OpenAIClient _client;
    private const string Model = "gpt-4.1-mini";

    public OpenAIService(IConfiguration configuration)
    {
        var apiKey = configuration["OpenAI:ApiKey"] 
            ?? throw new ArgumentNullException("OpenAI API key not found in configuration");
        _client = new OpenAIClient(apiKey);
    }

    public async Task<AnalysisReport> AnalyzeServiceAsync(AnalysisRequest request)
    {
        var prompt = request.IsServiceName
            ? $"Analyze the service '{request.Input}' and provide a comprehensive report including:"
            : $"Analyze the following service description and provide a comprehensive report including:\n\n{request.Input}\n\nReport should include:";

        prompt += @"
1. Brief History: Founding year, milestones, etc.
2. Target Audience: Primary user segments
3. Core Features: Top 2-4 key functionalities
4. Unique Selling Points: Key differentiators
5. Business Model: How the service makes money
6. Tech Stack Insights: Any hints about technologies used
7. Perceived Strengths: Mentioned positives or standout features
8. Perceived Weaknesses: Cited drawbacks or limitations

Format the response as a JSON object with these exact keys:
{
    ""BriefHistory"": """",
    ""TargetAudience"": """",
    ""CoreFeatures"": """",
    ""UniqueSellingPoints"": """",
    ""BusinessModel"": """",
    ""TechStackInsights"": """",
    ""PerceivedStrengths"": """",
    ""PerceivedWeaknesses"": """"
}";

        var chatRequest = new ChatRequest(
            messages: [new Message( Role.User, prompt)],
            model: Model
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
            var report = System.Text.Json.JsonSerializer.Deserialize<AnalysisReport>(cleanedContent);
            if (report == null)
                throw new Exception("Deserialized object is null");
            return report;
        }
        catch (Exception ex)
        {
            Console.WriteLine("\n--- RAW OPENAI RESPONSE ---\n" + content + "\n--------------------------\n");
            Console.WriteLine($"Deserialization failed. Type attempted: {typeof(AnalysisReport)}");
            throw new Exception($"Failed to parse OpenAI response: {ex.Message}");
        }
    }
}
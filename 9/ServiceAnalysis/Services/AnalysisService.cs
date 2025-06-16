using ServiceAnalysis.Models;

namespace ServiceAnalysis.Services;

public class AnalysisService
{
    private readonly OpenAIService _openAIService;

    public AnalysisService(OpenAIService openAIService)
    {
        _openAIService = openAIService;
    }

    public async Task<string> GenerateReportAsync(AnalysisRequest request)
    {
        try
        {
            var report = await _openAIService.AnalyzeServiceAsync(request);
            return report.ToMarkdown();
        }
        catch (Exception ex)
        {
            return $"Error generating report: {ex.Message}";
        }
    }
} 
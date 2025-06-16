namespace ServiceAnalysis.Models;

public class AnalysisRequest
{
    public string Input { get; set; }
    public bool IsServiceName { get; set; }

    public AnalysisRequest(string input, bool isServiceName)
    {
        Input = input;
        IsServiceName = isServiceName;
    }
} 
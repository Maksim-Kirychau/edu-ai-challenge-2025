using Microsoft.Extensions.Configuration;
using ServiceAnalysis.Models;
using ServiceAnalysis.Services;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("config.json", optional: false)
    .Build();

var openAIService = new OpenAIService(configuration);
var analysisService = new AnalysisService(openAIService);

Console.WriteLine("Service Analysis Console Application");
Console.WriteLine("===================================");
Console.WriteLine("\nChoose input mode:");
Console.WriteLine("1. Analyze a known service (e.g., 'Spotify', 'Notion')");
Console.WriteLine("2. Analyze custom service description");

var choice = Console.ReadLine()?.Trim();
var isServiceName = choice == "1";

Console.WriteLine("\nEnter your input:");
var input = Console.ReadLine()?.Trim();

if (string.IsNullOrEmpty(input))
{
    Console.WriteLine("Error: Input cannot be empty");
    return;
}

var request = new AnalysisRequest(input, isServiceName);
Console.WriteLine("\nGenerating report...\n");

var report = await analysisService.GenerateReportAsync(request);
Console.WriteLine(report);

Console.WriteLine("\nWould you like to save the report to a file? (y/n)");
var saveChoice = Console.ReadLine()?.Trim().ToLower();

if (saveChoice == "y")
{
    var fileName = $"report_{DateTime.Now:yyyyMMdd_HHmmss}.md";
    await File.WriteAllTextAsync(fileName, report);
    Console.WriteLine($"\nReport saved to {fileName}");
}

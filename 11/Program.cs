using Microsoft.Extensions.Configuration;
using AudioAnalysis.Services;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("config.json", optional: false)
    .Build();

var openAIService = new OpenAIService(configuration);
var audioAnalysisService = new AudioAnalysisService(openAIService);

Console.WriteLine("Audio Transcription and Analysis Console Application");
Console.WriteLine("==================================================");
Console.WriteLine("\nThis application will:");
Console.WriteLine("1. Transcribe your audio file using OpenAI Whisper");
Console.WriteLine("2. Generate a summary using GPT");
Console.WriteLine("3. Analyze the transcript for statistics");
Console.WriteLine("4. Save all results to separate files");
Console.WriteLine();

Console.Write("Enter the path to your audio file: ");
var audioFilePath = Console.ReadLine()?.Trim();

if (string.IsNullOrEmpty(audioFilePath))
{
    Console.WriteLine("Error: Audio file path cannot be empty");
    return;
}

if (!File.Exists(audioFilePath))
{
    Console.WriteLine($"Error: File not found at {audioFilePath}");
    return;
}

try
{
    Console.WriteLine($"\nProcessing audio file: {audioFilePath}");
    Console.WriteLine(new string('-', 50));

    var baseFileName = Path.GetFileNameWithoutExtension(audioFilePath);
    
    // Process the audio file
    var (transcription, summary, analysis) = await audioAnalysisService.ProcessAudioFileAsync(audioFilePath);
    
    // Save results to files
    await audioAnalysisService.SaveResultsAsync(transcription, summary, analysis, baseFileName);
    
    // Display results in console
    audioAnalysisService.DisplayResults(summary, analysis);
    
    Console.WriteLine("\nProcessing completed successfully!");
}
catch (Exception ex)
{
    Console.WriteLine($"\nError: {ex.Message}");
    Console.WriteLine("Please check your audio file and try again.");
} 
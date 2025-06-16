# Service Analysis Console Application

A C# console application that analyzes services using OpenAI's GPT model to generate comprehensive reports. The application can analyze both well-known services (like Spotify, Notion) and custom service descriptions.

## Features

- Analyze known services by name
- Analyze custom service descriptions
- Generate comprehensive reports including:
  - Brief History
  - Target Audience
  - Core Features
  - Unique Selling Points
  - Business Model
  - Tech Stack Insights
  - Perceived Strengths
  - Perceived Weaknesses
- Save reports to markdown files
- Clean and formatted output

## Prerequisites

- .NET 8.0 SDK or later
- OpenAI API key

## Setup

1. Navigate to the ServiceAnalysis directory:
```bash
cd ServiceAnalysis
```

2. Create a `config.json` file in the project root with your OpenAI API key:
```json
{
    "OpenAI": {
        "ApiKey": "your-api-key-here"
    }
}
```

3. Build and run the application:
```bash
dotnet build
dotnet run
```

## Usage

1. Run the application using `dotnet run`
2. Choose input mode:
   - Option 1: Analyze a known service (e.g., 'Spotify', 'Notion')
   - Option 2: Analyze a custom service description
3. Enter your input
4. View the generated report
5. Optionally save the report to a file

## Project Structure

```
ServiceAnalysis/
├── Models/
│   ├── AnalysisRequest.cs    # Request model for service analysis
│   └── AnalysisReport.cs     # Report model with markdown formatting
├── Services/
│   ├── OpenAIService.cs      # OpenAI API integration
│   └── AnalysisService.cs    # Analysis workflow management
├── Program.cs                # Main application entry point
├── config.json              # Configuration file for API key
└── ServiceAnalysis.csproj   # Project file
```

## Dependencies

- Microsoft.Extensions.Configuration.Json (8.0.0)
- OpenAI-DotNet (8.6.4)

## Example Output

The application generates reports in markdown format, including sections for:
- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses

## Error Handling

The application includes robust error handling for:
- Missing or invalid API key
- Invalid service names or descriptions
- API communication issues
- JSON parsing errors

## Contributing

Feel free to submit issues and enhancement requests! 
# Audio Transcription and Analysis Console Application

A C# console application that transcribes audio files using OpenAI's Whisper API (`whisper-1` model), generates summaries using GPT (`gpt-4.1-mini`), and provides detailed analytics including word count, speaking speed, and frequently mentioned topics.

## Features

- **Audio Transcription**: Uses OpenAI's Whisper API (`whisper-1` model) to transcribe audio files
- **AI-Powered Summary**: Generates concise summaries using GPT-4.1-mini
- **Advanced Analytics**: Provides detailed statistics including:
  - Total word count
  - Speaking speed (words per minute)
  - Frequently mentioned topics with mention counts (top 3 or more)
- **File Management**: Automatically saves results to separate files with timestamps
- **Multiple Audio Formats**: Supports any audio file format supported by Whisper (see below)

## Prerequisites

- .NET 8.0 SDK or later
- OpenAI API key with access to Whisper and GPT models
- Internet connection for API calls
- Audio file to process (any file supported by Whisper, not just the provided sample)

## Installation

1. **Clone or download the project files** to your local machine

2. **Set up your OpenAI API key** in the configuration file:
   
   Edit the `config.json` file and replace the API key with your own:
   ```json
   {
       "OpenAI": {
           "ApiKey": "your_api_key_here"
       }
   }
   ```
   
   **Important**: Never commit your actual API key to version control. The `config.json` file should be added to `.gitignore` in production environments.

3. **Navigate to the project directory:**
   ```bash
   cd 11
   ```

## Running the Application

1. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

2. **Build the application:**
   ```bash
   dotnet build
   ```

3. **Run the application:**
   ```bash
   dotnet run
   ```

4. **Enter the path to your audio file** when prompted. You can use any audio file supported by Whisper, not just the provided sample.

## Usage

1. **Start the application** using the commands above

2. **Provide the audio file path** when prompted:
   - Use absolute path: `C:\Users\YourName\Desktop\audio.mp3`
   - Use relative path: `./audio.wav`
   - Drag and drop the file into the terminal (on supported systems)
   - **You can use any audio file, not just the provided sample.**

3. **Wait for processing** - the application will:
   - Transcribe the audio using Whisper (`whisper-1`)
   - Generate a summary using GPT (`gpt-4.1-mini`)
   - Analyze the transcript for statistics
   - Save all results to files

4. **View results** - the application will display:
   - Summary of the audio content
   - Analytics including word count and speaking speed
   - List of frequently mentioned topics

## Output Files

The application creates an `outputs` directory and saves three files for each processed audio file:

- **`{filename}_transcription_{timestamp}.md`**: Complete transcript of the audio
- **`{filename}_summary_{timestamp}.md`**: AI-generated summary
- **`{filename}_analysis_{timestamp}.json`**: Analytics in JSON format

Example output structure:
```
outputs/
├── meeting_transcription_20241201_143022.md
├── meeting_summary_20241201_143022.md
└── meeting_analysis_20241201_143022.json
```

## Example Analysis Output

The analysis JSON file contains:
```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132.5,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Supported Audio Formats

The application supports all audio formats supported by OpenAI's Whisper API:
- MP3
- MP4
- Mpeg
- MPGA
- M4A
- WAV
- WebM

## Project Structure

```
11/
├── Program.cs                    # Main application entry point
├── AudioAnalysis.csproj          # Project file with dependencies
├── config.json                   # Configuration file with API key
├── Models/
│   └── AnalysisResult.cs         # Data models for analysis results
├── Services/
│   ├── OpenAIService.cs          # OpenAI API integration
│   └── AudioAnalysisService.cs   # Main business logic
├── outputs/                      # Generated output files
├── README.md                     # This file
├── transcription.md              # Sample transcription output
├── summary.md                    # Sample summary output
└── analysis.json                 # Sample analysis output
```

## Dependencies

- **OpenAI-DotNet** (v8.6.4): OpenAI API client library with Whisper and GPT support
- **Microsoft.Extensions.Configuration.Json** (v8.0.0): Configuration management
- **Newtonsoft.Json** (v13.0.3): JSON serialization/deserialization

## Configuration

The application uses a `config.json` file to store configuration settings:

```json
{
    "OpenAI": {
        "ApiKey": "your_openai_api_key_here"
    }
}
```

## Error Handling

The application includes comprehensive error handling for:
- Missing or invalid OpenAI API key
- Network connectivity issues
- Invalid audio file formats
- File access permissions
- API rate limiting
- Malformed audio files

## Security Notes

- **Never commit your API key** to version control
- The application reads the API key from the `config.json` file
- Consider using environment variables or secure configuration management in production
- Add `config.json` to `.gitignore` to prevent accidental commits

## Troubleshooting

**"OpenAI API key not found in configuration"**
- Ensure the `config.json` file exists in the project directory
- Verify the API key is correctly set in the configuration file
- Check that the JSON format is valid

**"File not found"**
- Verify the audio file path is correct
- Use absolute paths if relative paths don't work
- Check file permissions

**"Error transcribing audio"**
- Verify your OpenAI API key is valid
- Check your internet connection
- Ensure you have sufficient API credits
- Verify the audio file format is supported

**"Error generating summary" or "Error analyzing transcript"**
- Check your OpenAI API quota
- Verify the transcription was successful
- Ensure the audio file contains clear speech

## API Usage

The application uses two OpenAI APIs:
1. **Whisper API**: For audio transcription
2. **GPT-4.1-mini**: For summary generation and transcript analysis

Each audio file processing consumes API tokens based on:
- Audio file length (for transcription)
- Transcript length (for summary and analysis)

## Limitations

- Audio duration estimation is approximate (based on word count)
- Speaking speed calculation assumes average speaking rate
- Topic extraction depends on GPT's interpretation of the content
- Large audio files may take longer to process and consume more API credits

## Future Enhancements

- Real audio duration detection
- Multiple language support
- Speaker identification
- Sentiment analysis
- Custom topic extraction
- Batch processing of multiple files 
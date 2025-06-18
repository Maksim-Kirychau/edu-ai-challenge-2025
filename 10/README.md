# Product Search Application

A C# console application that uses OpenAI's function calling to filter products based on natural language queries. The application loads product data from a JSON file and allows users to search for products using natural language input.

## Features

- **Natural Language Processing**: Accepts user queries in natural language (e.g., "I need electronics under $200 with good ratings")
- **OpenAI Function Calling**: Uses OpenAI's function calling mechanism to extract filtering criteria from user input
- **Multiple Filter Criteria**: Supports filtering by:
  - Maximum price
  - Minimum rating
  - Product categories (Electronics, Fitness, Kitchen, Books, Clothing)
  - Stock availability
  - Product names
- **Structured Output**: Returns filtered products in a clear, formatted list

## Prerequisites

- .NET 8.0 SDK or later
- OpenAI API key
- Internet connection for API calls

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
   cd 10
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

## Usage

1. **Start the application** using the commands above

2. **Enter your search query** in natural language. Examples:
   - "I need electronics under $200"
   - "Show me fitness equipment with rating above 4.5"
   - "Find kitchen appliances that are in stock"
   - "I want books about programming"
   - "Smartphone under $800 with good ratings"

3. **View the results** - the application will display matching products with their details

4. **Type 'exit'** to quit the application

## Example Queries

- "Electronics under $100"
- "Fitness equipment with rating 4.5 or higher"
- "Kitchen appliances in stock"
- "Books about science"
- "Clothing items under $50"
- "Smartphone or laptop under $1000"
- "High-rated electronics that are available"

## Project Structure

```
10/
├── Program.cs                 # Main application entry point
├── Product.cs                 # Product model class
├── ProductFilter.cs           # Filter criteria model
├── ProductSearchService.cs    # OpenAI API integration and filtering logic
├── ProductSearchApp.csproj    # Project file with dependencies
├── products.json             # Product dataset
├── config.json               # Configuration file with API key
├── README.md                 # This file
└── sample_outputs.md         # Sample application outputs
```

## Dependencies

- **OpenAI-DotNet** (v8.6.4): OpenAI API client library with function calling support
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
- Invalid JSON data
- API rate limiting
- Malformed user input

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

**"Could not load products from products.json"**
- Ensure the `products.json` file exists in the project directory
- Check that the JSON file is properly formatted

**"Error during product search"**
- Verify your OpenAI API key is valid
- Check your internet connection
- Ensure you have sufficient API credits

## API Usage

The application uses OpenAI's GPT-4.1-mini model with function calling to:
1. Parse natural language queries
2. Extract filtering criteria
3. Return structured filter parameters
4. Apply filters to the product dataset

Each search query consumes API tokens based on the input length and complexity.

## Function Calling

The application implements OpenAI's function calling feature to extract structured data from natural language input. The `filter_products` function accepts the following parameters:

- `max_price`: Maximum price filter (number)
- `min_rating`: Minimum rating filter (number)
- `categories`: Product categories to include (array of strings)
- `in_stock_only`: Filter for in-stock items only (boolean)
- `product_names`: Specific product names to search for (array of strings) 
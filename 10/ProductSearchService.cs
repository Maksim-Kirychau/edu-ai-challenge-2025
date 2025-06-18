using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OpenAI;
using OpenAI.Chat;

namespace ProductSearchApp
{
    public class ProductSearchService
    {
        private readonly OpenAIClient _client;
        private readonly List<Product> _products;

        public ProductSearchService(IConfiguration configuration, List<Product> products)
        {
            var apiKey = configuration["OpenAI:ApiKey"] 
                ?? throw new ArgumentNullException("OpenAI API key not found in configuration");
            _client = new OpenAIClient(apiKey);
            _products = products;
        }

        public async Task<List<Product>> SearchProductsAsync(string userQuery)
        {
            try
            {
                var functionSchema = new
                {
                    type = "object",
                    properties = new
                    {
                        max_price = new { type = "number", description = "Maximum price filter" },
                        min_rating = new { type = "number", description = "Minimum rating filter" },
                        categories = new { type = "array", items = new { type = "string" }, description = "Product categories to include" },
                        in_stock_only = new { type = "boolean", description = "Filter for in-stock items only" },
                        product_names = new { type = "array", items = new { type = "string" }, description = "Specific product names to search for" }
                    }
                };

                var chatRequest = new ChatRequest(
                    messages: new List<Message>
                    {
                        new(Role.System, "You are a product search assistant. Analyze the user's natural language query and extract filtering criteria. Available categories: Electronics, Fitness, Kitchen, Books, Clothing. Use the filter_products function to return the appropriate filter parameters."),
                        new(Role.User, userQuery)
                    },
                    model: "gpt-4.1-mini",
                    tools: new List<Tool>
                    {
                        new(new Function("filter_products", "Filter products based on user preferences", JsonConvert.SerializeObject(functionSchema)))
                    },
                    toolChoice: "auto"
                );

                var response = await _client.ChatEndpoint.GetCompletionAsync(chatRequest);
                var choice = response.Choices.FirstOrDefault();
                var toolCall = choice?.Message?.ToolCalls?.FirstOrDefault();
                
                if (toolCall is { Function: not null })
                {
                    var argumentsJson = toolCall.Function.Arguments;
                    var filterParams = JsonConvert.DeserializeObject<ProductFilter>(argumentsJson?.ToString() ?? "{}");
                    return ApplyFilters(filterParams);
                }

                return [];
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during product search: {ex.Message}");
                return [];
            }
        }

        private List<Product> ApplyFilters(ProductFilter? filter)
        {
            if (filter == null) return _products;

            var filteredProducts = _products.AsEnumerable();

            if (filter.MaxPrice.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.Price <= filter.MaxPrice.Value);
            }

            if (filter.MinRating.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.Rating >= filter.MinRating.Value);
            }

            if (filter.Categories?.Count > 0)
            {
                filteredProducts = filteredProducts.Where(p => filter.Categories.Contains(p.Category, StringComparer.OrdinalIgnoreCase));
            }

            if (filter.InStockOnly.HasValue && filter.InStockOnly.Value)
            {
                filteredProducts = filteredProducts.Where(p => p.InStock);
            }

            if (filter.ProductNames?.Count > 0)
            {
                filteredProducts = filteredProducts.Where(p =>
                    filter.ProductNames.Any(name =>
                        p.Name.Contains(name, StringComparison.OrdinalIgnoreCase)));
            }

            return filteredProducts.ToList();
        }
    }
} 
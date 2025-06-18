using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace ProductSearchApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("config.json", optional: false)
                .Build();

            Console.WriteLine("=== Product Search Application ===");
            Console.WriteLine("Enter your search query in natural language (e.g., 'I need electronics under $200')");
            Console.WriteLine("Type 'exit' to quit the application.\n");

            // Load products from JSON file
            var products = LoadProducts();
            if (products == null || !products.Any())
            {
                Console.WriteLine("Error: Could not load products from products.json");
                return;
            }

            var searchService = new ProductSearchService(configuration, products);

            while (true)
            {
                Console.Write("Enter your search query: ");
                var userQuery = Console.ReadLine()?.Trim();

                if (string.IsNullOrEmpty(userQuery))
                {
                    Console.WriteLine("Please enter a valid search query.\n");
                    continue;
                }

                if (userQuery.ToLower() == "exit")
                {
                    Console.WriteLine("Goodbye!");
                    break;
                }

                Console.WriteLine("\nSearching for products...");
                
                try
                {
                    var results = await searchService.SearchProductsAsync(userQuery);
                    
                    Console.WriteLine("\nFiltered Products:");
                    if (results.Any())
                    {
                        for (int i = 0; i < results.Count; i++)
                        {
                            Console.WriteLine($"{i + 1}. {results[i]}");
                        }
                    }
                    else
                    {
                        Console.WriteLine("No products found matching your criteria.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                }

                Console.WriteLine("\n" + new string('-', 50) + "\n");
            }
        }

        static List<Product>? LoadProducts()
        {
            try
            {
                var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "products.json");
                if (!File.Exists(jsonPath))
                {
                    // Try relative path
                    jsonPath = "products.json";
                }

                var jsonContent = File.ReadAllText(jsonPath);
                return JsonConvert.DeserializeObject<List<Product>>(jsonContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading products: {ex.Message}");
                return null;
            }
        }
    }
} 
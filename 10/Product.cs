using Newtonsoft.Json;

namespace ProductSearchApp
{
    public class Product
    {
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        [JsonProperty("category")]
        public string Category { get; set; } = string.Empty;

        [JsonProperty("price")]
        public decimal Price { get; set; }

        [JsonProperty("rating")]
        public decimal Rating { get; set; }

        [JsonProperty("in_stock")]
        public bool InStock { get; set; }

        public override string ToString()
        {
            return $"{Name} - ${Price:F2}, Rating: {Rating:F1}, {(InStock ? "In Stock" : "Out of Stock")}";
        }
    }
} 
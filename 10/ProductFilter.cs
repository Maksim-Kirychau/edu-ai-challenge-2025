using Newtonsoft.Json;

namespace ProductSearchApp
{
    public class ProductFilter
    {
        [JsonProperty("max_price")]
        public decimal? MaxPrice { get; set; }

        [JsonProperty("min_rating")]
        public decimal? MinRating { get; set; }

        [JsonProperty("categories")]
        public List<string>? Categories { get; set; }

        [JsonProperty("in_stock_only")]
        public bool? InStockOnly { get; set; }

        [JsonProperty("product_names")]
        public List<string>? ProductNames { get; set; }
    }
} 
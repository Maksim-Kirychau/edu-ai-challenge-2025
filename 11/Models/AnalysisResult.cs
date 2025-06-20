using Newtonsoft.Json;

namespace AudioAnalysis.Models
{
    public class AnalysisResult
    {
        [JsonProperty("word_count")]
        public int WordCount { get; set; }

        [JsonProperty("speaking_speed_wpm")]
        public double SpeakingSpeedWpm { get; set; }

        [JsonProperty("frequently_mentioned_topics")]
        public List<TopicMention> FrequentlyMentionedTopics { get; set; } = new List<TopicMention>();
    }

    public class TopicMention
    {
        [JsonProperty("topic")]
        public string Topic { get; set; } = string.Empty;

        [JsonProperty("mentions")]
        public int Mentions { get; set; }
    }
} 
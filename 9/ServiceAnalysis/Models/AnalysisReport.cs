using System.Text.Json.Serialization;

namespace ServiceAnalysis.Models;

public class AnalysisReport
{
    [JsonPropertyName("BriefHistory")]
    public string? BriefHistory { get; set; }

    [JsonPropertyName("TargetAudience")]
    public string? TargetAudience { get; set; }

    [JsonPropertyName("CoreFeatures")]
    public string? CoreFeatures { get; set; }

    [JsonPropertyName("UniqueSellingPoints")]
    public string? UniqueSellingPoints { get; set; }

    [JsonPropertyName("BusinessModel")]
    public string? BusinessModel { get; set; }

    [JsonPropertyName("TechStackInsights")]
    public string? TechStackInsights { get; set; }

    [JsonPropertyName("PerceivedStrengths")]
    public string? PerceivedStrengths { get; set; }

    [JsonPropertyName("PerceivedWeaknesses")]
    public string? PerceivedWeaknesses { get; set; }

    public string ToMarkdown()
    {
        return $@"# Service Analysis Report

## Brief History
{BriefHistory}

## Target Audience
{TargetAudience}

## Core Features
{CoreFeatures}

## Unique Selling Points
{UniqueSellingPoints}

## Business Model
{BusinessModel}

## Tech Stack Insights
{TechStackInsights}

## Perceived Strengths
{PerceivedStrengths}

## Perceived Weaknesses
{PerceivedWeaknesses}";
    }
} 
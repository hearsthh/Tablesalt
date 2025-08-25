import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, platform, restaurantContext = {} } = await request.json()

    if (!content || !platform) {
      return NextResponse.json({ error: "Content and platform are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a social media hashtag expert specializing in restaurant marketing. Generate relevant, trending, and effective hashtags for maximum reach and engagement.`,
      prompt: `Generate hashtags for this social media content:

Content: "${content}"
Platform: ${platform}
Restaurant Context: ${JSON.stringify(restaurantContext)}

Consider:
- Platform-specific hashtag best practices
- Mix of popular and niche hashtags
- Local/location-based hashtags
- Food and cuisine-specific tags
- Trending hashtags in the restaurant industry
- Branded hashtags for the restaurant

Provide 15-20 hashtags with popularity and relevance scores.

Return as JSON array with this structure:
[{
  "hashtag": "#foodie",
  "popularity": "high",
  "relevance": 95,
  "category": "food",
  "estimatedReach": 50000
}]`,
    })

    let hashtags
    try {
      hashtags = JSON.parse(text)
    } catch (parseError) {
      // Fallback hashtags
      hashtags = [
        { hashtag: "#restaurant", popularity: "high", relevance: 90, category: "food", estimatedReach: 100000 },
        { hashtag: "#foodie", popularity: "high", relevance: 95, category: "food", estimatedReach: 80000 },
        { hashtag: "#delicious", popularity: "medium", relevance: 85, category: "food", estimatedReach: 60000 },
        { hashtag: "#yummy", popularity: "medium", relevance: 80, category: "food", estimatedReach: 45000 },
        { hashtag: "#tasty", popularity: "medium", relevance: 82, category: "food", estimatedReach: 40000 },
      ]
    }

    return NextResponse.json({
      success: true,
      hashtags,
      message: `Generated ${hashtags.length} hashtag suggestions`,
    })
  } catch (error) {
    console.error("AI hashtag generation error:", error)
    return NextResponse.json({ error: "Failed to generate hashtags" }, { status: 500 })
  }
}

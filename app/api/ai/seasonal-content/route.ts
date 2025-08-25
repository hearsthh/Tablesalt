import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { season, occasion, restaurantContext } = await request.json()

    if (!season || !restaurantContext) {
      return NextResponse.json({ error: "Season and restaurant context are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a seasonal marketing specialist for restaurants. Create timely, relevant content that connects with seasonal trends and occasions.`,
      prompt: `Create seasonal social media content for:

Season: ${season}
Occasion: ${occasion || "General seasonal"}
Restaurant: ${restaurantContext.name || "Restaurant"}
Cuisine: ${restaurantContext.cuisine || "Various"}

Create:
1. 8-10 seasonal social media posts
2. Seasonal promotions and offers
3. Relevant hashtags for the season/occasion
4. Content that connects the restaurant's offerings with seasonal themes

Consider:
- Seasonal ingredients and menu items
- Holiday and occasion-specific messaging
- Weather-appropriate content
- Seasonal customer behaviors and preferences
- Local seasonal events and traditions

Return as JSON with this structure:
{
  "season": "${season}",
  "occasion": "${occasion || "General"}",
  "posts": [/* array of seasonal posts */],
  "promotions": [/* seasonal promotions */],
  "hashtags": [/* seasonal hashtags */]
}`,
    })

    let seasonalContent
    try {
      seasonalContent = JSON.parse(text)
    } catch (parseError) {
      // Fallback seasonal content
      seasonalContent = {
        season,
        occasion: occasion || "General",
        posts: [
          {
            id: "seasonal-1",
            platform: "instagram",
            content: {
              text: `Embrace the flavors of ${season}! Our seasonal menu features the freshest ingredients perfect for this time of year.`,
              hashtags: [`#${season}Menu`, "#SeasonalFlavors", "#FreshIngredients"],
              callToAction: "Try our seasonal specials!",
            },
            tone: "seasonal",
            targetAudience: "seasonal food enthusiasts",
            estimatedEngagement: 85,
            reasoning: "Connects restaurant offerings with seasonal themes",
          },
        ],
        promotions: [
          {
            title: `${season} Special Menu`,
            description: `Enjoy our specially crafted ${season} dishes made with seasonal ingredients`,
            discount: "15% off seasonal items",
            validUntil: "End of season",
          },
        ],
        hashtags: [`#${season}`, "#SeasonalMenu", "#FreshIngredients"],
      }
    }

    return NextResponse.json({
      success: true,
      seasonalContent,
      message: `Generated seasonal content for ${season}`,
    })
  } catch (error) {
    console.error("AI seasonal content generation error:", error)
    return NextResponse.json({ error: "Failed to generate seasonal content" }, { status: 500 })
  }
}

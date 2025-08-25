import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { campaignTheme, duration, platforms, restaurantContext } = await request.json()

    if (!campaignTheme || !duration || !platforms || !restaurantContext) {
      return NextResponse.json({ error: "All campaign parameters are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a social media campaign strategist for restaurants. Create comprehensive campaign content with strategic scheduling and platform optimization.`,
      prompt: `Create a ${duration}-day social media campaign for:

Campaign Theme: ${campaignTheme}
Platforms: ${platforms.join(", ")}
Restaurant: ${restaurantContext.name || "Restaurant"}
Cuisine: ${restaurantContext.cuisine || "Various"}

Create:
1. 15-20 posts across all platforms
2. Strategic posting schedule
3. Platform-specific content adaptations
4. Hashtag strategy
5. Overall campaign strategy

Consider:
- Platform best practices and optimal posting times
- Content variety (promotional, educational, behind-the-scenes, user-generated)
- Engagement tactics and calls-to-action
- Cross-platform consistency while respecting platform differences
- Campaign momentum building

Return as JSON with this structure:
{
  "campaignId": "campaign-id",
  "theme": "${campaignTheme}",
  "posts": [/* array of posts */],
  "schedule": [/* posting schedule */],
  "hashtags": [/* campaign hashtags */],
  "overallStrategy": "Campaign strategy explanation"
}`,
    })

    let campaign
    try {
      campaign = JSON.parse(text)
    } catch (parseError) {
      // Fallback campaign
      campaign = {
        campaignId: `campaign-${Date.now()}`,
        theme: campaignTheme,
        posts: platforms.map((platform: string, index: number) => ({
          id: `post-${index + 1}`,
          platform,
          content: {
            text: `Join our ${campaignTheme} campaign! Experience the best of ${restaurantContext.cuisine || "cuisine"} at ${restaurantContext.name || "our restaurant"}.`,
            hashtags: [`#${campaignTheme.replace(/\s+/g, "")}`, "#restaurant", "#foodie"],
            callToAction: "Book your table now!",
          },
          tone: "promotional",
          targetAudience: "food enthusiasts",
          estimatedEngagement: 80,
          reasoning: "Campaign launch post to generate initial buzz",
        })),
        schedule: [],
        hashtags: [
          {
            hashtag: `#${campaignTheme.replace(/\s+/g, "")}`,
            popularity: "medium",
            relevance: 100,
            category: "branded",
            estimatedReach: 10000,
          },
        ],
        overallStrategy: `Multi-platform campaign focusing on ${campaignTheme} to drive awareness and bookings`,
      }
    }

    return NextResponse.json({
      success: true,
      campaign,
      message: `Generated campaign content for ${campaignTheme}`,
    })
  } catch (error) {
    console.error("AI campaign content generation error:", error)
    return NextResponse.json({ error: "Failed to generate campaign content" }, { status: 500 })
  }
}

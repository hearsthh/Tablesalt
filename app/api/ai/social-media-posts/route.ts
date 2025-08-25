import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { restaurantContext, options = {} } = await request.json()

    if (!restaurantContext) {
      return NextResponse.json({ error: "Restaurant context is required" }, { status: 400 })
    }

    const {
      platforms = ["facebook", "instagram", "twitter"],
      tone = "engaging",
      contentType = "promotional",
      menuItems = [],
      occasion = "",
      count = 5,
    } = options

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a social media content creator specializing in restaurant marketing. Create engaging, platform-appropriate posts that drive customer engagement and sales.`,
      prompt: `Create ${count} social media posts for a restaurant with the following context:

Restaurant: ${restaurantContext.name || "Restaurant"}
Cuisine: ${restaurantContext.cuisine || "Various"}
Location: ${restaurantContext.location || "Local"}
Brand Voice: ${restaurantContext.brandVoice || "Friendly and welcoming"}

Requirements:
- Platforms: ${platforms.join(", ")}
- Tone: ${tone}
- Content Type: ${contentType}
- Occasion: ${occasion || "General"}
${menuItems.length > 0 ? `- Featured Items: ${menuItems.map((item: any) => item.name).join(", ")}` : ""}

For each post, consider:
- Platform-specific character limits and best practices
- Engaging hooks and calls-to-action
- Relevant hashtags (3-5 per platform)
- Visual content suggestions
- Optimal posting times

Return as JSON array with this structure:
[{
  "id": "post-1",
  "platform": "instagram",
  "content": {
    "text": "Post content here...",
    "hashtags": ["#hashtag1", "#hashtag2"],
    "mentions": ["@mention"],
    "callToAction": "Visit us today!"
  },
  "tone": "engaging",
  "targetAudience": "food lovers",
  "estimatedEngagement": 85,
  "reasoning": "Why this post will work..."
}]`,
    })

    let posts
    try {
      posts = JSON.parse(text)
    } catch (parseError) {
      // Fallback posts if parsing fails
      posts = platforms.map((platform: string, index: number) => ({
        id: `post-${index + 1}`,
        platform,
        content: {
          text: `Delicious ${restaurantContext.cuisine || "food"} awaits you at ${restaurantContext.name || "our restaurant"}! Come taste the difference.`,
          hashtags: ["#delicious", "#restaurant", "#foodie"],
          callToAction: "Visit us today!",
        },
        tone,
        targetAudience: "food lovers",
        estimatedEngagement: 75,
        reasoning: "Simple promotional post to drive visits",
      }))
    }

    return NextResponse.json({
      success: true,
      posts,
      message: `Generated ${posts.length} social media posts`,
    })
  } catch (error) {
    console.error("AI social media posts generation error:", error)
    return NextResponse.json({ error: "Failed to generate social media posts" }, { status: 500 })
  }
}

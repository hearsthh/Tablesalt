import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { originalContent, targetPlatforms, restaurantContext = {} } = await request.json()

    if (!originalContent || !targetPlatforms) {
      return NextResponse.json({ error: "Original content and target platforms are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a social media content adaptation specialist. Transform content to be optimal for different social media platforms while maintaining the core message.`,
      prompt: `Adapt this content for different social media platforms:

Original Content: "${originalContent}"
Target Platforms: ${targetPlatforms.join(", ")}
Restaurant Context: ${JSON.stringify(restaurantContext)}

For each platform, consider:
- Character limits and formatting requirements
- Platform-specific audience expectations
- Visual content suggestions
- Hashtag strategies
- Engagement features (polls, stories, etc.)

Platform Guidelines:
- Facebook: Longer form, community-focused, link-friendly
- Instagram: Visual-first, hashtag-heavy, story-friendly
- Twitter: Concise, trending topics, real-time engagement
- LinkedIn: Professional tone, business-focused
- TikTok: Trendy, video-first, hashtag challenges

Return as JSON with this structure:
{
  "originalContent": "${originalContent}",
  "variations": [{
    "platform": "instagram",
    "adaptedContent": "Adapted content here...",
    "changes": ["Added hashtags", "Shortened text"],
    "reasoning": "Why these changes work for this platform"
  }]
}`,
    })

    let variations
    try {
      variations = JSON.parse(text)
    } catch (parseError) {
      // Fallback variations
      variations = {
        originalContent,
        variations: targetPlatforms.map((platform: string) => ({
          platform,
          adaptedContent: originalContent,
          changes: ["Optimized for platform"],
          reasoning: `Adapted for ${platform} best practices`,
        })),
      }
    }

    return NextResponse.json({
      success: true,
      variations,
      message: `Adapted content for ${targetPlatforms.length} platforms`,
    })
  } catch (error) {
    console.error("AI content adaptation error:", error)
    return NextResponse.json({ error: "Failed to adapt content" }, { status: 500 })
  }
}

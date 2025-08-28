import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (reviewsError) {
      console.error("Reviews fetch error:", reviewsError)
      return NextResponse.json({ error: "Failed to fetch reviews data" }, { status: 500 })
    }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        summary: "No reviews found",
        insights: [],
        ctas: ["Encourage customers to leave reviews"],
        tasks: [],
      })
    }

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const ratingDistribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const reviewData = reviews.map((review) => ({
      rating: review.rating,
      content: review.content,
      platform: review.platform,
      sentiment_label: review.sentiment_label,
      keywords: review.keywords,
      created_at: review.created_at,
    }))

    const { text } = await generateText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Analyze these restaurant reviews and create an improvement plan:

Current Average Rating: ${avgRating.toFixed(1)}/5
Rating Distribution: ${JSON.stringify(ratingDistribution)}
Recent Reviews: ${JSON.stringify(reviewData.slice(0, 20), null, 2)}

Create a comprehensive improvement plan to increase the star rating. Focus on:
1. Most common complaints and how to address them
2. Service improvement opportunities
3. Food quality enhancements
4. Operational changes needed
5. Specific actionable tasks with priorities

Format as JSON with: summary, insights (array of {title, description, impact, priority}), ctas (array of strings), tasks (array of {task, priority, timeline, department})`,
      system:
        "You are a restaurant operations consultant specializing in review analysis and customer satisfaction improvement. Provide specific, actionable recommendations.",
    })

    const aiResponse = JSON.parse(text)

    return NextResponse.json({
      summary: aiResponse.summary,
      insights: aiResponse.insights || [],
      ctas: aiResponse.ctas || [],
      tasks: aiResponse.tasks || [],
      metadata: {
        currentRating: avgRating,
        totalReviews: reviews.length,
        ratingDistribution,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Reviews improvement plan error:", error)
    return NextResponse.json({ error: "Failed to generate improvement plan" }, { status: 500 })
  }
}

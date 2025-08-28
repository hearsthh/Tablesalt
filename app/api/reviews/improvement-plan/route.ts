import { type NextRequest, NextResponse } from "next/server"
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

    const lowRatings = reviews.filter((r) => r.rating <= 3).length
    const highRatings = reviews.filter((r) => r.rating >= 4).length
    const negativeReviews = reviews.filter((r) => r.sentiment_label === "negative").length

    const insights = [
      {
        title: "Overall Rating Performance",
        description: `Current average rating is ${avgRating.toFixed(1)}/5 stars`,
        impact: avgRating >= 4 ? "positive" : "needs_attention",
        priority: avgRating < 3.5 ? "high" : "medium",
      },
      {
        title: "Review Distribution",
        description: `${highRatings} positive vs ${lowRatings} negative reviews`,
        impact: "medium",
        priority: "medium",
      },
      {
        title: "Sentiment Analysis",
        description: `${negativeReviews} reviews identified as negative sentiment`,
        impact: "high",
        priority: negativeReviews > reviews.length * 0.3 ? "high" : "low",
      },
    ]

    const tasks = [
      {
        task: "Address common complaints from low-rated reviews",
        priority: "high",
        timeline: "immediate",
        department: "operations",
      },
      {
        task: "Implement customer feedback collection system",
        priority: "medium",
        timeline: "2 weeks",
        department: "management",
      },
      {
        task: "Train staff on customer service excellence",
        priority: avgRating < 4 ? "high" : "medium",
        timeline: "1 month",
        department: "hr",
      },
    ]

    return NextResponse.json({
      summary: `Analysis of ${reviews.length} reviews shows ${avgRating.toFixed(1)}/5 average rating with improvement opportunities`,
      insights,
      ctas: [
        "Focus on addressing negative feedback patterns",
        "Implement proactive customer satisfaction measures",
        "Monitor review trends weekly",
      ],
      tasks,
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

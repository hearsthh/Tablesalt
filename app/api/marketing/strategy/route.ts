import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { campaign_type, target_audience, budget, goals } = await request.json()
    const supabase = await createClient()

    const [restaurantResult, customersResult, reviewsResult, menuResult] = await Promise.all([
      supabase.from("restaurants").select("*").limit(1).single(),
      supabase.from("customers").select("customer_segment, preferences, total_spent").limit(100),
      supabase.from("reviews").select("rating, sentiment_label, keywords").limit(50),
      supabase.from("menu_items").select("name, price, tags, is_featured").eq("is_available", true),
    ])

    const restaurant = restaurantResult.data
    const customers = customersResult.data || []
    const reviews = reviewsResult.data || []
    const menuItems = menuResult.data || []

    const contextData = {
      restaurant: {
        name: restaurant?.name,
        cuisine_type: restaurant?.cuisine_type,
        price_range: restaurant?.price_range,
        description: restaurant?.description,
      },
      customerInsights: {
        totalCustomers: customers.length,
        segments: [...new Set(customers.map((c) => c.customer_segment).filter(Boolean))],
        avgSpent: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length,
      },
      reputation: {
        avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
        commonKeywords: reviews.flatMap((r) => r.keywords || []).slice(0, 10),
      },
      menu: {
        totalItems: menuItems.length,
        featuredItems: menuItems.filter((item) => item.is_featured),
        priceRange: {
          min: Math.min(...menuItems.map((item) => item.price || 0)),
          max: Math.max(...menuItems.map((item) => item.price || 0)),
        },
      },
    }

    const { text } = await generateText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Create a comprehensive marketing strategy for this restaurant:

Restaurant Context: ${JSON.stringify(contextData, null, 2)}

Campaign Requirements:
- Type: ${campaign_type || "general"}
- Target Audience: ${target_audience || "all customers"}
- Budget: ${budget || "moderate"}
- Goals: ${goals || "increase revenue and customer acquisition"}

Create a detailed marketing strategy including:
1. Campaign objectives and KPIs
2. Target audience analysis and personas
3. Channel strategy (social media, email, local advertising)
4. Content themes and messaging
5. Promotional offers and incentives
6. Timeline and budget allocation
7. Success metrics and tracking

Format as JSON with: summary, insights (array of {title, description, impact, channel}), ctas (array of strings), campaigns (array of {name, description, channels, budget, timeline, kpis})`,
      system:
        "You are a restaurant marketing strategist with expertise in local marketing, customer acquisition, and retention campaigns. Provide specific, actionable marketing strategies.",
    })

    const aiResponse = JSON.parse(text)

    return NextResponse.json({
      summary: aiResponse.summary,
      insights: aiResponse.insights || [],
      ctas: aiResponse.ctas || [],
      campaigns: aiResponse.campaigns || [],
      metadata: {
        restaurantName: restaurant?.name,
        contextData,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Marketing strategy error:", error)
    return NextResponse.json({ error: "Failed to generate marketing strategy" }, { status: 500 })
  }
}

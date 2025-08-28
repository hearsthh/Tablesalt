import { type NextRequest, NextResponse } from "next/server"
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

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
    const avgSpent =
      customers.length > 0 ? customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length : 0
    const featuredItems = menuItems.filter((item) => item.is_featured)

    const campaigns = [
      {
        name: "Customer Acquisition Campaign",
        description: "Attract new customers with compelling offers",
        channels: ["social_media", "local_advertising", "referral_program"],
        budget: budget === "high" ? "$2000-5000" : budget === "low" ? "$500-1000" : "$1000-2000",
        timeline: "4-6 weeks",
        kpis: ["new_customer_count", "cost_per_acquisition", "conversion_rate"],
      },
      {
        name: "Loyalty & Retention Campaign",
        description: "Increase repeat visits from existing customers",
        channels: ["email", "sms", "in_store"],
        budget: budget === "high" ? "$1000-2000" : budget === "low" ? "$200-500" : "$500-1000",
        timeline: "ongoing",
        kpis: ["repeat_visit_rate", "customer_lifetime_value", "retention_rate"],
      },
      {
        name: "Featured Menu Promotion",
        description: `Promote ${featuredItems.length} featured menu items`,
        channels: ["social_media", "email", "in_store_displays"],
        budget: budget === "high" ? "$800-1500" : budget === "low" ? "$200-400" : "$400-800",
        timeline: "2-3 weeks",
        kpis: ["featured_item_sales", "average_order_value", "social_engagement"],
      },
    ]

    const insights = [
      {
        title: "Restaurant Positioning",
        description: `${restaurant?.cuisine_type || "Restaurant"} with ${avgRating.toFixed(1)}/5 rating`,
        impact: "high",
        channel: "branding",
      },
      {
        title: "Customer Value Analysis",
        description: `Average customer spend: $${avgSpent.toFixed(2)}`,
        impact: "medium",
        channel: "pricing",
      },
      {
        title: "Menu Promotion Opportunities",
        description: `${featuredItems.length} featured items ready for promotion`,
        impact: "medium",
        channel: "content",
      },
    ]

    return NextResponse.json({
      summary: `Marketing strategy developed for ${restaurant?.name || "restaurant"} focusing on ${campaign_type || "general"} campaigns`,
      insights,
      ctas: [
        "Launch customer acquisition campaign with local targeting",
        "Implement loyalty program for repeat customers",
        "Create social media content showcasing featured items",
      ],
      campaigns,
      metadata: {
        restaurantName: restaurant?.name,
        avgRating,
        totalCustomers: customers.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Marketing strategy error:", error)
    return NextResponse.json({ error: "Failed to generate marketing strategy" }, { status: 500 })
  }
}

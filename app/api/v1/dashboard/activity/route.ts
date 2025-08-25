import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const restaurantId = restaurant.id

    const [ordersResult, reviewsResult, customersResult] = await Promise.all([
      supabase
        .from("orders")
        .select("id, total_amount, created_at, customer_name")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("reviews")
        .select("id, rating, comment, customer_name, created_at")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("customers")
        .select("id, name, email, created_at")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(3),
    ])

    // Combine and format activity feed
    const activities = []

    // Add orders
    if (ordersResult.data) {
      ordersResult.data.forEach((order) => {
        activities.push({
          id: `order-${order.id}`,
          type: "order",
          title: "New Order",
          description: `$${order.total_amount} from ${order.customer_name || "Customer"}`,
          timestamp: order.created_at,
          icon: "shopping-cart",
        })
      })
    }

    // Add reviews
    if (reviewsResult.data) {
      reviewsResult.data.forEach((review) => {
        activities.push({
          id: `review-${review.id}`,
          type: "review",
          title: "New Review",
          description: `${review.rating}★ - ${review.comment?.substring(0, 50) || "No comment"}...`,
          timestamp: review.created_at,
          icon: "star",
        })
      })
    }

    // Add new customers
    if (customersResult.data) {
      customersResult.data.forEach((customer) => {
        activities.push({
          id: `customer-${customer.id}`,
          type: "customer",
          title: "New Customer",
          description: `${customer.name} joined`,
          timestamp: customer.created_at,
          icon: "user-plus",
        })
      })
    }

    // Sort by timestamp and limit to 10 most recent
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivity = activities.slice(0, 10)

    // Add demo data if no real activity for Phase 0
    if (recentActivity.length === 0) {
      const demoActivity = [
        {
          id: "demo-1",
          type: "order",
          title: "New Order",
          description: "$52.40 from Sarah Johnson",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          icon: "shopping-cart",
        },
        {
          id: "demo-2",
          type: "review",
          title: "New Review",
          description: "5★ - Amazing food and great service!",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          icon: "star",
        },
        {
          id: "demo-3",
          type: "customer",
          title: "New Customer",
          description: "Mike Chen joined",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          icon: "user-plus",
        },
      ]
      return NextResponse.json({ success: true, data: demoActivity })
    }

    return NextResponse.json({ success: true, data: recentActivity })
  } catch (error) {
    console.error("[v0] Dashboard activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

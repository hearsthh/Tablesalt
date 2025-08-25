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

    const [ordersResult, customersResult, reviewsResult] = await Promise.all([
      // Get orders data for last 30 days
      supabase
        .from("orders")
        .select("total_amount, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Get customers data
      supabase
        .from("customers")
        .select("id, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Get reviews data
      supabase
        .from("reviews")
        .select("rating, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    // Calculate stats with fallback to demo data for Phase 0
    const orders = ordersResult.data || []
    const customers = customersResult.data || []
    const reviews = reviewsResult.data || []

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 28475
    const totalOrders = orders.length || 124
    const newCustomers = customers.length || 23
    const avgRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 4.2

    // Calculate trends (mock for Phase 0)
    const stats = {
      revenue: {
        current: totalRevenue,
        change: 12.5,
        trend: "up" as const,
      },
      orders: {
        current: totalOrders,
        change: 8.3,
        trend: "up" as const,
      },
      customers: {
        current: newCustomers,
        change: 15.2,
        trend: "up" as const,
      },
      rating: {
        current: avgRating,
        change: 0.1,
        trend: "up" as const,
      },
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

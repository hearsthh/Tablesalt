import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get authenticated user and check admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get system overview data
    const [restaurantsResult, usersResult, integrationsResult] = await Promise.all([
      supabase.from("restaurants").select("id, name, status, created_at"),
      supabase.from("user_profiles").select("id, created_at"),
      supabase.from("restaurant_integrations").select("id, status"),
    ])

    const restaurants = restaurantsResult.data || []
    const users = usersResult.data || []
    const integrations = integrationsResult.data || []

    // Calculate metrics
    const totalRestaurants = restaurants.length
    const activeRestaurants = restaurants.filter((r) => r.status === "active").length
    const totalUsers = users.length
    const activeIntegrations = integrations.filter((i) => i.status === "connected").length

    // Calculate revenue (mock for Phase 0)
    const totalRevenue = totalRestaurants * 28475 // Average revenue per restaurant

    const overview = {
      totalRestaurants,
      activeRestaurants,
      totalUsers,
      activeIntegrations,
      totalRevenue,
      systemHealth: "healthy",
      uptime: 99.9,
    }

    return NextResponse.json({ success: true, data: overview })
  } catch (error) {
    console.error("[v0] Admin overview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

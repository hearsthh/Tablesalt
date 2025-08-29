import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { PHASE0_CONFIG } from "@/lib/stripe/phase0-config"

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

    const [subscriptionsResult, usageResult, restaurantsResult] = await Promise.all([
      supabase.from("user_subscriptions").select(`
        id, user_id, plan, status, current_period_end, created_at,
        user_profiles!inner(name, email)
      `),
      supabase.from("usage_tracking").select("user_id, resource_type, usage_count"),
      supabase.from("restaurants").select("id, name, user_id, status"),
    ])

    const subscriptions = subscriptionsResult.data || []
    const usage = usageResult.data || []
    const restaurants = restaurantsResult.data || []

    // Calculate billing metrics
    const totalSubscriptions = subscriptions.length
    const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length
    const trialSubscriptions = subscriptions.filter((s) => s.plan === "phase0_trial").length
    const totalRevenue = subscriptions.reduce((sum, sub) => {
      if (sub.plan === "starter") return sum + 49
      if (sub.plan === "professional") return sum + 149
      if (sub.plan === "enterprise") return sum + 399
      return sum // Phase 0 trial is free
    }, 0)

    // Group usage by user
    const usageByUser = usage.reduce(
      (acc, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = {}
        acc[item.user_id][item.resource_type] = item.usage_count
        return acc
      },
      {} as Record<string, Record<string, number>>,
    )

    // Combine data for restaurant billing overview
    const restaurantBilling = restaurants.map((restaurant) => {
      const subscription = subscriptions.find((s) => s.user_id === restaurant.user_id)
      const restaurantUsage = usageByUser[restaurant.user_id] || {}

      return {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        userId: restaurant.user_id,
        userEmail: subscription?.user_profiles?.email || "N/A",
        plan: subscription?.plan || "none",
        status: subscription?.status || "inactive",
        trialEndDate: subscription?.current_period_end || null,
        usage: {
          aiGenerations: restaurantUsage.ai_generations || 0,
          campaigns: restaurantUsage.campaigns || 0,
          menuItems: restaurantUsage.menu_items || 0,
        },
        isPhase0: restaurant.id.startsWith("rest_00"), // Simple Phase 0 detection
      }
    })

    const billingOverview = {
      metrics: {
        totalSubscriptions,
        activeSubscriptions,
        trialSubscriptions,
        totalRevenue,
        phase0Restaurants: trialSubscriptions,
        trialEndDate: new Date(Date.now() + PHASE0_CONFIG.trialPeriodDays * 24 * 60 * 60 * 1000).toISOString(),
      },
      restaurants: restaurantBilling,
      phase0Config: PHASE0_CONFIG,
    }

    return NextResponse.json({ success: true, data: billingOverview })
  } catch (error) {
    console.error("[v0] Admin billing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

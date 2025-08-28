import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    let query = supabase
      .from("analytics_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .range(offset, offset + limit - 1)

    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId)
    }

    const { data: events, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      pagination: {
        limit,
        offset,
        total: events?.length || 0,
      },
    })
  } catch (error) {
    console.error("Analytics events error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

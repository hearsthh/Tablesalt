import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")

    let query = supabase.from("categories").select("*").order("display_order", { ascending: true })

    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const body = await request.json()

    const { data, error } = await supabase.from("categories").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

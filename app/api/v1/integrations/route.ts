import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    if (restaurantError) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const { data: integrations, error } = await supabase
      .from("restaurant_integrations")
      .select("*")
      .eq("restaurant_id", restaurant.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: integrations || [] })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { integrations, country } = body

    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    if (restaurantError) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Delete existing integrations for this restaurant
    await supabase.from("restaurant_integrations").delete().eq("restaurant_id", restaurant.id)

    // Insert new integrations
    const integrationRecords = integrations.map((integrationId: string) => ({
      restaurant_id: restaurant.id,
      provider_name: integrationId,
      status: "demo", // Start in demo mode for Phase 0
      config: {
        country,
        demo_mode: true,
        connected_at: new Date().toISOString(),
      },
    }))

    const { data: newIntegrations, error: insertError } = await supabase
      .from("restaurant_integrations")
      .insert(integrationRecords)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Update setup progress
    await fetch("/api/v1/setup/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "integrations", completed: true }),
    })

    return NextResponse.json({ data: newIntegrations })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

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

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("settings")
      .eq("owner_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const setupProgress = restaurant?.settings?.setup_progress || {
      restaurant_info: false,
      integrations: false,
      data_import: false,
    }

    return NextResponse.json({ data: setupProgress })
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
    const { step, completed } = body

    const { data: restaurant, error: fetchError } = await supabase
      .from("restaurants")
      .select("settings")
      .eq("owner_id", user.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const currentSettings = restaurant?.settings || {}
    const setupProgress = currentSettings.setup_progress || {}

    const updatedProgress = {
      ...setupProgress,
      [step]: completed,
    }

    const { error: updateError } = await supabase.from("restaurants").upsert({
      owner_id: user.id,
      settings: {
        ...currentSettings,
        setup_progress: updatedProgress,
        onboarding_completed: Object.values(updatedProgress).every(Boolean),
      },
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ data: updatedProgress })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

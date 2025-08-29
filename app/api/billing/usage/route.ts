import { type NextRequest, NextResponse } from "next/server"
import { UsageTracker } from "@/lib/billing/usage-tracker"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get("resource_type")

    const supabase = await createServerClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usageTracker = new UsageTracker()
    const usage = await usageTracker.getUserUsage(user.id, resourceType as any)

    return NextResponse.json({ usage })
  } catch (error) {
    console.error("Usage API error:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resourceType, count = 1 } = await request.json()

    const supabase = await createServerClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usageTracker = new UsageTracker()
    await usageTracker.trackUsage(user.id, resourceType, count)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Usage tracking API error:", error)
    return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
  }
}

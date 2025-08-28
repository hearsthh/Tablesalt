import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Database client not available" }, { status: 503 })
    }

    // Simple connectivity test
    const { data, error } = await supabase.from("restaurants").select("id").limit(1)

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 })
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      status: "Database connection healthy",
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}

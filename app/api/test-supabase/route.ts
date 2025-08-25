import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    console.log("[v0] Server-side env check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlLength: supabaseUrl.length,
      keyLength: supabaseKey.length,
    })

    const result = {
      success: !!(supabaseUrl && supabaseKey),
      error: !supabaseUrl || !supabaseKey ? "Missing environment variables" : null,
      details: `URL: ${supabaseUrl ? "✅ Found" : "❌ Missing"}, Key: ${supabaseKey ? "✅ Found" : "❌ Missing"}`,
      connected: !!(supabaseUrl && supabaseKey),
      envVars: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl.length,
        keyLength: supabaseKey.length,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error during test",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

    let projectName = null
    let urlPattern = null

    if (supabaseUrl) {
      try {
        const url = new URL(supabaseUrl)
        projectName = url.hostname.split(".")[0]
        urlPattern = supabaseUrl.substring(0, 30) + "..."
      } catch (urlError) {
        console.error("Error parsing Supabase URL:", urlError)
        // Continue with null values
      }
    }

    return NextResponse.json({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
      projectName,
      urlPattern,
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json({ error: "Failed to check environment variables" }, { status: 500 })
  }
}

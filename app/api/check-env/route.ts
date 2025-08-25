import { NextResponse } from "next/server"

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

  return NextResponse.json({
    supabaseUrl: !!supabaseUrl,
    supabaseKey: !!supabaseKey,
    projectName: supabaseUrl ? new URL(supabaseUrl).hostname.split(".")[0] : null,
    urlPattern: supabaseUrl ? supabaseUrl.substring(0, 30) + "..." : null,
  })
}

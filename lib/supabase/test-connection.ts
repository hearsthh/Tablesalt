import { createClient } from "@supabase/supabase-js"

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

    console.log("[v0] Supabase URL available:", !!supabaseUrl)
    console.log("[v0] Supabase Key available:", !!supabaseKey)

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: "Missing environment variables",
        details: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required",
        connected: false,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.auth.getSession()

    console.log("[v0] Supabase connection test:", { data, error })

    return {
      success: !error,
      error: error?.message,
      connected: true,
      sessionData: data,
    }
  } catch (err) {
    console.log("[v0] Supabase connection error:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      connected: false,
    }
  }
}

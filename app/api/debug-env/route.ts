import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check all possible Supabase environment variables
    const envVars = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_JWT_SECRET: !!process.env.SUPABASE_JWT_SECRET,
      // Check all environment variables that start with SUPABASE
      allSupabaseVars: Object.keys(process.env)
        .filter((key) => key.includes("SUPABASE"))
        .reduce(
          (acc, key) => {
            acc[key] = !!process.env[key]
            return acc
          },
          {} as Record<string, boolean>,
        ),
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

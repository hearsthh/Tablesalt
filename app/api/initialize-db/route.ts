import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Check if tables already exist by trying to query one
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Try to query profiles table to see if it exists
    const { error: checkError } = await supabaseAdmin.from("profiles").select("id").limit(1)

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: "Database already initialized",
      })
    }

    return NextResponse.json({
      success: false,
      requiresManualSetup: true,
      message: "Database setup required",
      instructions: {
        title: "Run Database Schema Script",
        steps: [
          "1. Go to your Supabase project dashboard",
          "2. Navigate to the SQL Editor",
          "3. Run the script: scripts/create-production-database-schema.sql",
          "4. This will create all necessary tables with proper security policies",
        ],
        scriptName: "create-production-database-schema.sql",
      },
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Failed to check database status" }, { status: 500 })
  }
}

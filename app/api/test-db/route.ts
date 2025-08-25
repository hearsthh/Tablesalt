import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("Environment check:", {
      url: !!supabaseUrl,
      key: !!supabaseServiceKey,
      urlValue: supabaseUrl?.substring(0, 20) + "...",
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase configuration",
          details: "Supabase URL or key not found",
          env: {
            url: !!supabaseUrl,
            key: !!supabaseServiceKey,
          },
        },
        { status: 500 },
      )
    }

    const supabase = createSupabaseServerClient()

    // Test connection by fetching restaurants
    const { data: restaurants, error: restaurantError } = await supabase.from("restaurants").select("*").limit(1)

    if (restaurantError) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant query failed",
          details: restaurantError,
        },
        { status: 500 },
      )
    }

    // Test categories
    const { data: categories, error: categoryError } = await supabase.from("categories").select("*").limit(3)

    if (categoryError) {
      return NextResponse.json(
        {
          success: false,
          error: "Category query failed",
          details: categoryError,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: {
        restaurants: restaurants?.length || 0,
        categories: categories?.length || 0,
        sampleRestaurant: restaurants?.[0]?.name,
        sampleCategories: categories?.map((c) => c.name),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Connection failed",
        details: error,
      },
      { status: 500 },
    )
  }
}

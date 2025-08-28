import { NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerClient()

        const { data: restaurants, error } = await supabase
          .from("restaurants")
          .select("id, name, cuisine_type, description")
          .limit(10)

        if (!error && restaurants) {
          return NextResponse.json({
            restaurants: restaurants,
            source: "database",
          })
        }
      } catch (dbError) {
        console.log("[v0] Database connection failed, using demo data:", dbError)
      }
    }

    const demoRestaurants = [
      { id: "1", name: "Bella Vista Italian", cuisine_type: "Italian", description: "Authentic Italian cuisine" },
      { id: "2", name: "Dragon Palace", cuisine_type: "Chinese", description: "Traditional Chinese dishes" },
      { id: "3", name: "Taco Libre", cuisine_type: "Mexican", description: "Fresh Mexican flavors" },
      { id: "4", name: "Le Petit Bistro", cuisine_type: "French", description: "Classic French bistro" },
      { id: "5", name: "Sakura Sushi", cuisine_type: "Japanese", description: "Fresh sushi and sashimi" },
    ]

    return NextResponse.json({
      restaurants: demoRestaurants,
      source: "demo",
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

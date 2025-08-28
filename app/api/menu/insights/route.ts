import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select(`
        *,
        menu_categories(name)
      `)
      .eq("is_available", true)
      .order("created_at", { ascending: false })

    if (menuError) {
      console.error("Menu fetch error:", menuError)
      return NextResponse.json({ error: "Failed to fetch menu data" }, { status: 500 })
    }

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        summary: "No menu items found",
        insights: [],
        ctas: ["Add menu items to get insights"],
        menuScore: 0,
      })
    }

    const categories = [...new Set(menuItems.map((item) => item.menu_categories?.name).filter(Boolean))]
    const avgPrice = menuItems.reduce((sum, item) => sum + (item.price || 0), 0) / menuItems.length
    const featuredItems = menuItems.filter((item) => item.is_featured)

    const insights = [
      {
        title: "Menu Diversity",
        description: `Your menu spans ${categories.length} categories with ${menuItems.length} total items`,
        impact: "high",
        category: "structure",
      },
      {
        title: "Pricing Analysis",
        description: `Average item price is $${avgPrice.toFixed(2)}`,
        impact: "medium",
        category: "pricing",
      },
      {
        title: "Featured Items",
        description: `${featuredItems.length} items are currently featured`,
        impact: "medium",
        category: "promotion",
      },
    ]

    const ctas = [
      "Review pricing strategy for competitive positioning",
      "Consider promoting high-margin items",
      "Analyze customer favorites for menu optimization",
    ]

    return NextResponse.json({
      summary: `Menu analysis complete for ${menuItems.length} items across ${categories.length} categories`,
      insights,
      ctas,
      menuScore: Math.min(85, 60 + categories.length * 5 + featuredItems.length * 3),
      metadata: {
        totalItems: menuItems.length,
        categories,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Menu insights error:", error)
    return NextResponse.json({ error: "Failed to generate menu insights" }, { status: 500 })
  }
}

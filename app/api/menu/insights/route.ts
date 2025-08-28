import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
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
        ctas: ["Add menu items to get AI insights"],
        menuScore: 0,
      })
    }

    const menuData = menuItems.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.menu_categories?.name,
      calories: item.calories,
      tags: item.tags,
      dietary_info: item.dietary_info,
    }))

    const { text } = await generateText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Analyze this restaurant menu and provide actionable insights:

Menu Items: ${JSON.stringify(menuData, null, 2)}

Please provide:
1. Overall menu performance analysis
2. Pricing optimization suggestions
3. Popular item predictions
4. Menu engineering recommendations
5. Specific actionable insights for each category

Format as JSON with: summary, insights (array of {title, description, impact, category}), ctas (array of strings), menuScore (0-100)`,
      system:
        "You are a restaurant menu optimization expert. Provide data-driven insights to improve menu performance, pricing, and customer satisfaction.",
    })

    const aiResponse = JSON.parse(text)

    return NextResponse.json({
      summary: aiResponse.summary,
      insights: aiResponse.insights || [],
      ctas: aiResponse.ctas || [],
      menuScore: aiResponse.menuScore || 75,
      metadata: {
        totalItems: menuItems.length,
        categories: [...new Set(menuItems.map((item) => item.menu_categories?.name).filter(Boolean))],
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Menu insights error:", error)
    return NextResponse.json({ error: "Failed to generate menu insights" }, { status: 500 })
  }
}

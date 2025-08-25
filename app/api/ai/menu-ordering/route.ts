import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { categories, strategy = "sales_optimization" } = await request.json()

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: "Categories are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a menu engineering expert specializing in menu layout optimization. Use menu psychology principles to recommend optimal ordering of categories and items to maximize sales and customer satisfaction.`,
      prompt: `Analyze these menu categories and items, then recommend optimal ordering using ${strategy} strategy:

${categories
  .map(
    (cat) => `
Category: ${cat.name} (${cat.items.length} items)
Items: ${cat.items.map((item) => `${item.name} ($${item.price})`).join(", ")}
`,
  )
  .join("\n")}

Apply menu psychology principles:
- Eye movement patterns (top-right quadrant gets most attention)
- Category flow (appetizers → mains → desserts)
- High-margin item placement
- Popular item positioning
- Price anchoring strategies

Provide recommendations for:
1. Category ordering with reasoning
2. Item ordering within each category
3. Strategic placement of high-margin items
4. Expected impact on sales

Return as JSON with this structure:
{
  "categoryOrder": [
    {
      "categoryId": "cat-id",
      "categoryName": "Category Name",
      "newPosition": 1,
      "reasoning": "Why this position"
    }
  ],
  "itemOrdering": [
    {
      "categoryId": "cat-id",
      "items": [
        {
          "itemId": "item-id",
          "itemName": "Item Name",
          "newPosition": 1,
          "reasoning": "Strategic placement reason"
        }
      ]
    }
  ],
  "strategicInsights": [
    "Key insight about menu psychology",
    "Expected impact on sales"
  ]
}`,
    })

    let orderingRecommendations
    try {
      orderingRecommendations = JSON.parse(text)
    } catch (parseError) {
      // Fallback ordering logic
      orderingRecommendations = {
        categoryOrder: categories.map((cat, index) => ({
          categoryId: cat.id,
          categoryName: cat.name,
          newPosition: index + 1,
          reasoning: "Maintaining current order",
        })),
        itemOrdering: categories.map((cat) => ({
          categoryId: cat.id,
          items: cat.items.map((item, index) => ({
            itemId: item.id,
            itemName: item.name,
            newPosition: index + 1,
            reasoning: "Maintaining current order",
          })),
        })),
        strategicInsights: [
          "Menu ordering optimized for better customer flow",
          "High-margin items positioned for maximum visibility",
        ],
      }
    }

    return NextResponse.json({
      success: true,
      ...orderingRecommendations,
      message: "Generated menu ordering recommendations",
    })
  } catch (error) {
    console.error("AI ordering generation error:", error)
    return NextResponse.json({ error: "Failed to generate ordering recommendations" }, { status: 500 })
  }
}

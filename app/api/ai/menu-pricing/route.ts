import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuItems, selectedItems, strategy = "profit_optimization" } = await request.json()

    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ error: "Menu items are required" }, { status: 400 })
    }

    const itemsToAnalyze =
      selectedItems?.length > 0 ? menuItems.filter((item) => selectedItems.includes(item.id)) : menuItems

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a restaurant pricing strategist with expertise in menu psychology and profit optimization. Analyze menu items and provide data-driven pricing recommendations.`,
      prompt: `Analyze these menu items and provide pricing recommendations using ${strategy} strategy:

${itemsToAnalyze.map((item) => `- ${item.name}: $${item.price} (${item.category}) - ${item.description || "No description"}`).join("\n")}

Consider:
- Current market positioning
- Category pricing patterns
- Psychological pricing principles
- Profit margin optimization
- Customer value perception

For each item, provide:
1. Current price analysis
2. Recommended price with reasoning
3. Expected impact on sales volume
4. Profit margin implications
5. Implementation timeline

Return as JSON array with this structure:
[{
  "itemId": "item-id",
  "itemName": "Item Name",
  "currentPrice": 18.99,
  "recommendedPrice": 19.95,
  "priceChange": 0.96,
  "changePercentage": 5.1,
  "reasoning": "Psychological pricing ending in .95 increases perceived value",
  "expectedSalesImpact": "5-10% decrease in volume, 15% increase in revenue",
  "profitImpact": "positive",
  "implementation": "immediate",
  "confidence": "high"
}]`,
    })

    let pricingRecommendations
    try {
      pricingRecommendations = JSON.parse(text)
    } catch (parseError) {
      // Fallback pricing suggestions
      pricingRecommendations = itemsToAnalyze.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        currentPrice: item.price,
        recommendedPrice: Math.round(item.price * 1.05 * 100) / 100,
        priceChange: Math.round(item.price * 0.05 * 100) / 100,
        changePercentage: 5,
        reasoning: "Standard 5% increase for inflation adjustment",
        expectedSalesImpact: "Minimal impact expected",
        profitImpact: "positive",
        implementation: "gradual",
        confidence: "medium",
      }))
    }

    return NextResponse.json({
      success: true,
      pricingRecommendations,
      message: `Generated pricing recommendations for ${pricingRecommendations.length} items`,
    })
  } catch (error) {
    console.error("AI pricing generation error:", error)
    return NextResponse.json({ error: "Failed to generate pricing recommendations" }, { status: 500 })
  }
}

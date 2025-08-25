import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuItems, selectedItems, restaurantContext } = await request.json()

    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ error: "Menu items are required" }, { status: 400 })
    }

    const itemsToAnalyze =
      selectedItems?.length > 0 ? menuItems.filter((item) => selectedItems.includes(item.id)) : menuItems

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert restaurant consultant with 15+ years of experience in menu optimization and combo creation. 
      Your expertise includes:
      - Food pairing and flavor complementarity
      - Profit margin optimization
      - Customer psychology and ordering behavior
      - Inventory management and food cost control
      - Cross-selling and upselling strategies
      
      Always consider:
      - Food preparation synergies (items that can be prepared together efficiently)
      - Complementary flavors and textures
      - Price psychology (ending in .99, .95, etc.)
      - Portion sizes and customer satisfaction
      - Seasonal availability and ingredient costs`,
      prompt: `Restaurant Context: ${restaurantContext?.name || "Restaurant"} - ${restaurantContext?.cuisineType || "Mixed cuisine"} restaurant
      Average order value: $${restaurantContext?.averageOrderValue || 25}
      Peak hours: ${restaurantContext?.peakHours || "6-8 PM"}
      Target demographic: ${restaurantContext?.targetDemographic || "General"}

Analyze these menu items and create 3-5 strategic combo deals that maximize profit and customer satisfaction:

${itemsToAnalyze
  .map(
    (item) =>
      `- ${item.name}: $${item.price} (${item.category}) - Cost: $${item.cost_price || item.price * 0.3} - Prep time: ${item.preparation_time || 15}min
    Description: ${item.description || "No description"}
    Popularity: ${item.popularity_score || 50}/100`,
  )
  .join("\n")}

BUSINESS RULES:
1. Minimum 15% profit margin on combos
2. Include at least one high-margin item per combo
3. Consider preparation time synergies
4. Target 20-30% savings to drive adoption
5. Create combos that increase average order value by at least $3

For each combo, provide detailed analysis:
1. Strategic combo name (appetizing and memorable)
2. Items that complement each other (flavor, texture, temperature)
3. Precise pricing with profit margin calculations
4. Customer psychology reasoning
5. Operational efficiency benefits
6. Target customer segment with demographics
7. Suggested upsell opportunities

Return as JSON array with this structure:
[{
  "id": "combo-1",
  "name": "Combo Name",
  "items": ["item-id-1", "item-id-2"],
  "itemNames": ["Item Name 1", "Item Name 2"],
  "originalPrice": 25.99,
  "comboPrice": 22.99,
  "savings": 3.00,
  "savingsPercentage": 12,
  "profitMargin": 18.5,
  "description": "Perfect for families seeking authentic flavors...",
  "category": "Combos",
  "targetSegment": "families",
  "operationalBenefits": "Items can be prepared simultaneously",
  "upsellOpportunities": ["Add dessert for $3", "Upgrade to premium sides"],
  "expectedOrderValueIncrease": 4.50,
  "confidence": "high"
}]`,
    })

    let combos
    try {
      combos = JSON.parse(text)
    } catch (parseError) {
      // Enhanced fallback with better business logic
      const popularItems = itemsToAnalyze.sort((a, b) => (b.popularity_score || 50) - (a.popularity_score || 50))
      const highMarginItems = itemsToAnalyze.filter((item) => {
        const cost = item.cost_price || item.price * 0.3
        return (item.price - cost) / item.price > 0.6
      })

      combos = [
        {
          id: "combo-1",
          name: "Chef's Signature Combo",
          items: popularItems.slice(0, 2).map((item) => item.id),
          itemNames: popularItems.slice(0, 2).map((item) => item.name),
          originalPrice: popularItems.slice(0, 2).reduce((sum, item) => sum + item.price, 0),
          comboPrice:
            Math.round(popularItems.slice(0, 2).reduce((sum, item) => sum + item.price, 0) * 0.82 * 100) / 100,
          savings: Math.round(popularItems.slice(0, 2).reduce((sum, item) => sum + item.price, 0) * 0.18 * 100) / 100,
          savingsPercentage: 18,
          profitMargin: 22,
          description: "Our most popular dishes combined for the perfect dining experience",
          category: "Combos",
          targetSegment: "general",
          operationalBenefits: "Streamlined kitchen workflow",
          upsellOpportunities: ["Add beverage for $2.99"],
          expectedOrderValueIncrease: 3.5,
          confidence: "medium",
        },
      ]
    }

    return NextResponse.json({
      success: true,
      combos,
      message: `Generated ${combos.length} strategic combo suggestions`,
      businessInsights: {
        averageSavings: combos.reduce((sum, combo) => sum + combo.savingsPercentage, 0) / combos.length,
        projectedOrderValueIncrease:
          combos.reduce((sum, combo) => sum + (combo.expectedOrderValueIncrease || 0), 0) / combos.length,
      },
    })
  } catch (error) {
    console.error("AI combo generation error:", error)
    return NextResponse.json({ error: "Failed to generate combo suggestions" }, { status: 500 })
  }
}

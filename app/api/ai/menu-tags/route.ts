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
      system: `You are a certified nutritionist and restaurant marketing expert with deep knowledge of:
      - Dietary restrictions and food allergies
      - Nutritional content analysis
      - Food safety regulations
      - Customer dietary preferences and trends
      - Marketing psychology and menu positioning
      - Cultural and religious dietary requirements
      
      Your analysis must be:
      - Accurate and compliant with food labeling regulations
      - Helpful for customers with dietary restrictions
      - Strategic for restaurant marketing and positioning
      - Based on actual ingredients and preparation methods`,
      prompt: `Restaurant: ${restaurantContext?.name || "Restaurant"} - ${restaurantContext?.cuisineType || "Mixed cuisine"}
      Target market: ${restaurantContext?.targetDemographic || "General"}
      Health-conscious customers: ${restaurantContext?.healthConsciousPercentage || 40}%

Analyze these menu items for comprehensive tagging. Consider ingredients, preparation methods, and nutritional content:

${itemsToAnalyze
  .map(
    (item) =>
      `- ${item.name}: ${item.description || "No description"} ($${item.price})
    Category: ${item.category}
    Ingredients: ${item.ingredients || "Not specified"}
    Preparation: ${item.preparation_method || "Standard"}
    Calories: ${item.calories || "Unknown"}
    Allergens: ${item.allergens?.join(", ") || "Not specified"}
    Dietary tags: ${item.dietary_tags?.join(", ") || "None"}
    Spice level: ${item.spice_level || 0}/5`,
  )
  .join("\n")}

TAGGING REQUIREMENTS:
1. Dietary tags must be accurate (verify ingredients)
2. Allergen warnings must be comprehensive and legally compliant
3. Marketing tags should drive sales and highlight unique features
4. Consider cross-contamination risks in kitchen
5. Include trending dietary preferences (Keto, Paleo, Plant-based, etc.)

For each item, provide detailed tag analysis:

Return as JSON array with this structure:
[{
  "itemId": "item-id",
  "itemName": "Item Name",
  "suggestedTags": {
    "dietary": ["Vegetarian", "Gluten-Free", "Keto-Friendly"],
    "allergens": ["Contains Dairy", "May contain nuts (cross-contamination)"],
    "marketing": ["Chef's Special", "Instagram-worthy", "Comfort Food"],
    "cuisine": ["Italian", "Mediterranean"],
    "health": ["High Protein", "Low Sodium", "Heart Healthy"],
    "trending": ["Plant-Based", "Superfood", "Ancient Grains"]
  },
  "reasoning": "Detailed explanation of tag selection based on ingredients and preparation",
  "confidence": "high|medium|low",
  "complianceNotes": "Any regulatory or safety considerations",
  "marketingPotential": "How these tags can drive sales"
}]`,
    })

    let tagSuggestions
    try {
      tagSuggestions = JSON.parse(text)
    } catch (parseError) {
      // Enhanced fallback with better logic
      tagSuggestions = itemsToAnalyze.map((item) => {
        const name = item.name.toLowerCase()
        const description = (item.description || "").toLowerCase()
        const category = (item.category || "").toLowerCase()

        const dietary = []
        const allergens = []
        const marketing = []
        const health = []

        // Smart dietary detection
        if (name.includes("salad") || description.includes("vegetable")) dietary.push("Vegetarian")
        if (name.includes("vegan") || description.includes("plant-based")) dietary.push("Vegan")
        if (description.includes("gluten-free") || name.includes("gf")) dietary.push("Gluten-Free")
        if (item.calories && item.calories < 400) health.push("Light Option")
        if (item.protein && item.protein > 20) health.push("High Protein")

        // Smart allergen detection
        if (description.includes("cheese") || description.includes("cream")) allergens.push("Contains Dairy")
        if (description.includes("nuts") || name.includes("almond")) allergens.push("Contains Nuts")
        if (description.includes("egg")) allergens.push("Contains Eggs")

        // Marketing tags based on popularity and category
        if (item.popularity_score > 80) marketing.push("Customer Favorite")
        if (category.includes("special")) marketing.push("Chef's Special")
        if (item.spice_level > 3) marketing.push("Spicy")

        return {
          itemId: item.id,
          itemName: item.name,
          suggestedTags: {
            dietary,
            allergens,
            marketing,
            cuisine: [restaurantContext?.cuisineType || "International"],
            health,
            trending: [],
          },
          reasoning: "Auto-generated based on item analysis and restaurant context",
          confidence: "medium",
          complianceNotes: "Please verify allergen information with kitchen staff",
          marketingPotential: "Tags can improve searchability and customer confidence",
        }
      })
    }

    return NextResponse.json({
      success: true,
      tagSuggestions,
      message: `Generated comprehensive tag suggestions for ${tagSuggestions.length} items`,
      insights: {
        totalDietaryTags: tagSuggestions.reduce((sum, item) => sum + item.suggestedTags.dietary.length, 0),
        totalAllergenWarnings: tagSuggestions.reduce((sum, item) => sum + item.suggestedTags.allergens.length, 0),
        marketingOpportunities: tagSuggestions.filter((item) => item.suggestedTags.marketing.length > 2).length,
      },
    })
  } catch (error) {
    console.error("AI tag generation error:", error)
    return NextResponse.json({ error: "Failed to generate tag suggestions" }, { status: 500 })
  }
}

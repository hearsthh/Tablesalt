import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuItems, selectedItems, style = "appetizing" } = await request.json()

    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ error: "Menu items are required" }, { status: 400 })
    }

    const itemsToAnalyze =
      selectedItems?.length > 0 ? menuItems.filter((item) => selectedItems.includes(item.id)) : menuItems

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a professional menu writer and restaurant marketing expert. Create compelling, mouth-watering descriptions that increase sales and help customers understand what makes each dish special.`,
      prompt: `Rewrite descriptions for these menu items in a ${style} style:

${itemsToAnalyze.map((item) => `- ${item.name}: ${item.description || "No description"} ($${item.price})`).join("\n")}

Guidelines:
- Keep descriptions concise (15-25 words)
- Focus on key ingredients, cooking methods, and flavors
- Use sensory language that makes food sound appealing
- Highlight what makes each dish unique or special
- Avoid generic terms like "delicious" or "tasty"
- Include preparation method when relevant

Return as JSON array with this structure:
[{
  "itemId": "item-id",
  "itemName": "Item Name",
  "originalDescription": "Original description",
  "newDescription": "Enhanced appetizing description",
  "improvements": ["Added sensory details", "Highlighted cooking method"]
}]`,
    })

    let descriptions
    try {
      descriptions = JSON.parse(text)
    } catch (parseError) {
      // Fallback descriptions
      descriptions = itemsToAnalyze.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        originalDescription: item.description || "",
        newDescription: `${item.description || item.name} - expertly prepared with fresh ingredients`,
        improvements: ["Enhanced with professional language"],
      }))
    }

    return NextResponse.json({
      success: true,
      descriptions,
      message: `Generated enhanced descriptions for ${descriptions.length} items`,
    })
  } catch (error) {
    console.error("AI description generation error:", error)
    return NextResponse.json({ error: "Failed to generate descriptions" }, { status: 500 })
  }
}

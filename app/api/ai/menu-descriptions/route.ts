import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { menuItems, selectedItems, style = "appetizing" } = await request.json()

    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ error: "Menu items are required" }, { status: 400 })
    }

    const itemsToAnalyze =
      selectedItems?.length > 0 ? menuItems.filter((item) => selectedItems.includes(item.id)) : menuItems

    const apiKey = process.env.GROQ_API_KEY
    console.log("[v0] Environment check - GROQ_API_KEY exists:", !!apiKey)
    console.log("[v0] Environment check - GROQ_API_KEY length:", apiKey?.length || 0)

    if (!apiKey) {
      console.log("[v0] GROQ_API_KEY not accessible, providing demo AI descriptions for testing")

      const demoDescriptions = itemsToAnalyze.map((item, index) => ({
        itemId: item.id || `item-${index}`,
        itemName: item.name,
        originalDescription: item.description || "No description",
        newDescription: generateDemoDescription(item.name, item.price, style),
        improvements: ["Enhanced sensory appeal", "Added cooking method details", "Highlighted key ingredients"],
      }))

      return NextResponse.json({
        success: true,
        descriptions: demoDescriptions,
        message: `Generated enhanced descriptions for ${demoDescriptions.length} items (Demo Mode)`,
        source: "demo",
        note: "Using demo AI responses - API key not accessible in v0 preview",
      })
    }

    console.log("[v0] Attempting AI generation with Groq...")

    const result = await streamText({
      model: groq("llama-3.1-70b-versatile"),
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

    const { text } = await result
    console.log("[v0] AI generation successful")
    const descriptions = JSON.parse(text)

    return NextResponse.json({
      success: true,
      descriptions,
      message: `Generated enhanced descriptions for ${descriptions.length} items`,
      source: "ai",
    })
  } catch (error) {
    console.error("[v0] AI description generation error:", error)
    return NextResponse.json(
      {
        error: `AI description generation failed: ${error.message}`,
        details: error.message.includes("API key")
          ? "GROQ_API_KEY may not be accessible in API routes"
          : "AI service error",
        code: "AI_GENERATION_FAILED",
      },
      { status: 500 },
    )
  }
}

function generateDemoDescription(itemName: string, price: number, style: string): string {
  const descriptors = {
    appetizing: ["succulent", "tender", "crispy", "golden", "fresh", "aromatic", "savory"],
    elegant: ["artfully crafted", "delicately prepared", "expertly seasoned", "refined", "sophisticated"],
    casual: ["hearty", "comfort", "satisfying", "homestyle", "classic"],
  }

  const methods = ["grilled", "seared", "roasted", "braised", "pan-fried", "slow-cooked"]
  const ingredients = ["herbs", "spices", "seasonal vegetables", "premium ingredients", "house-made sauce"]

  const styleDescriptors = descriptors[style] || descriptors.appetizing
  const randomDescriptor = styleDescriptors[Math.floor(Math.random() * styleDescriptors.length)]
  const randomMethod = methods[Math.floor(Math.random() * methods.length)]
  const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)]

  return `${randomDescriptor} ${itemName.toLowerCase()} ${randomMethod} to perfection with ${randomIngredient}`
}

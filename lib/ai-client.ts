export class AIClient {
  private static baseUrl = "/api/ai"

  static async generateCombos(menuItems: any[], discount: number, instructions?: string) {
    const response = await fetch(`${this.baseUrl}/menu-combos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, discount, instructions }),
    })

    if (!response.ok) {
      throw new Error(`AI Combos API failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async generateTags(menuItems: any[], selectedTags: string[], customTags: string[] = []) {
    const response = await fetch(`${this.baseUrl}/menu-tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, selectedTags, customTags }),
    })

    if (!response.ok) {
      throw new Error(`AI Tags API failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async generateDescriptions(menuItems: any[], tone: string, length: string, instructions?: string) {
    const response = await fetch(`${this.baseUrl}/menu-descriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, tone, length, instructions }),
    })

    if (!response.ok) {
      throw new Error(`AI Descriptions API failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async generatePricing(menuItems: any[], instructions?: string) {
    const response = await fetch(`${this.baseUrl}/menu-pricing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, instructions }),
    })

    if (!response.ok) {
      throw new Error(`AI Pricing API failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async generateOrdering(categories: any[], instructions?: string) {
    const response = await fetch(`${this.baseUrl}/menu-ordering`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories, instructions }),
    })

    if (!response.ok) {
      throw new Error(`AI Ordering API failed: ${response.statusText}`)
    }

    return response.json()
  }
}

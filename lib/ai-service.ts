export interface AIComboResult {
  id: string
  name: string
  items: string[]
  itemNames: string[]
  originalPrice: number
  comboPrice: number
  savings: number
  savingsPercentage: number
  description: string
  category: string
  targetSegment: string
}

export interface AITagSuggestion {
  itemId: string
  itemName: string
  suggestedTags: {
    dietary: string[]
    allergens: string[]
    marketing: string[]
    cuisine: string[]
  }
  reasoning: string
}

export interface AIDescriptionResult {
  itemId: string
  itemName: string
  originalDescription: string
  newDescription: string
  improvements: string[]
}

export interface AIPricingRecommendation {
  itemId: string
  itemName: string
  currentPrice: number
  recommendedPrice: number
  priceChange: number
  changePercentage: number
  reasoning: string
  expectedSalesImpact: string
  profitImpact: string
  implementation: string
  confidence: string
}

export interface AIOrderingRecommendation {
  categoryOrder: Array<{
    categoryId: string
    categoryName: string
    newPosition: number
    reasoning: string
  }>
  itemOrdering: Array<{
    categoryId: string
    items: Array<{
      itemId: string
      itemName: string
      newPosition: number
      reasoning: string
    }>
  }>
  strategicInsights: string[]
}

// Adding social media content generation interfaces
export interface AISocialMediaPost {
  id: string
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "tiktok"
  content: {
    text: string
    hashtags: string[]
    mentions?: string[]
    callToAction?: string
  }
  tone: "professional" | "casual" | "playful" | "promotional" | "informative"
  targetAudience: string
  estimatedEngagement: number
  reasoning: string
}

export interface AIHashtagSuggestion {
  hashtag: string
  popularity: "high" | "medium" | "low"
  relevance: number
  category: "trending" | "niche" | "branded" | "location" | "food"
  estimatedReach: number
}

export interface AICampaignContent {
  campaignId: string
  theme: string
  posts: AISocialMediaPost[]
  schedule: {
    postId: string
    platform: string
    scheduledTime: string
    priority: number
  }[]
  hashtags: AIHashtagSuggestion[]
  overallStrategy: string
}

export interface AIContentVariation {
  originalContent: string
  variations: {
    platform: string
    adaptedContent: string
    changes: string[]
    reasoning: string
  }[]
}

export interface AISeasonalContent {
  season: string
  occasion: string
  posts: AISocialMediaPost[]
  promotions: {
    title: string
    description: string
    discount: string
    validUntil: string
  }[]
  hashtags: string[]
}

export class AIService {
  static async generateCombos(
    menuItems: any[],
    selectedItems?: string[],
    restaurantContext?: any,
  ): Promise<AIComboResult[]> {
    const response = await fetch("/api/ai/menu-combos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, selectedItems, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate combos")
    }

    const data = await response.json()
    return data.combos
  }

  static async generateTags(
    menuItems: any[],
    selectedItems?: string[],
    restaurantContext?: any,
  ): Promise<AITagSuggestion[]> {
    const response = await fetch("/api/ai/menu-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, selectedItems, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate tags")
    }

    const data = await response.json()
    return data.tagSuggestions
  }

  static async generateDescriptions(
    menuItems: any[],
    selectedItems?: string[],
    style = "appetizing",
    restaurantContext?: any,
  ): Promise<AIDescriptionResult[]> {
    const response = await fetch("/api/ai/menu-descriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, selectedItems, style, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate descriptions")
    }

    const data = await response.json()
    return data.descriptions
  }

  static async generatePricingRecommendations(
    menuItems: any[],
    selectedItems?: string[],
    strategy = "profit_optimization",
    restaurantContext?: any,
  ): Promise<AIPricingRecommendation[]> {
    const response = await fetch("/api/ai/menu-pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItems, selectedItems, strategy, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate pricing recommendations")
    }

    const data = await response.json()
    return data.pricingRecommendations
  }

  static async generateOrderingRecommendations(
    categories: any[],
    strategy = "sales_optimization",
    restaurantContext?: any,
  ): Promise<AIOrderingRecommendation> {
    const response = await fetch("/api/ai/menu-ordering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories, strategy, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate ordering recommendations")
    }

    const data = await response.json()
    return {
      categoryOrder: data.categoryOrder,
      itemOrdering: data.itemOrdering,
      strategicInsights: data.strategicInsights,
    }
  }

  static async generateBusinessInsights(restaurantData: any, timeframe = "30_days"): Promise<any> {
    const response = await fetch("/api/ai/business-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantData, timeframe }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate business insights")
    }

    const data = await response.json()
    return data.insights
  }

  static async generateSocialMediaPosts(
    restaurantContext: any,
    options: {
      platforms?: string[]
      tone?: string
      contentType?: "promotional" | "informational" | "engaging" | "seasonal"
      menuItems?: any[]
      occasion?: string
      count?: number
    } = {},
  ): Promise<AISocialMediaPost[]> {
    const response = await fetch("/api/ai/social-media-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantContext, options }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate social media posts")
    }

    const data = await response.json()
    return data.posts
  }

  static async generateHashtags(
    content: string,
    platform: string,
    restaurantContext?: any,
  ): Promise<AIHashtagSuggestion[]> {
    const response = await fetch("/api/ai/hashtags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, platform, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate hashtags")
    }

    const data = await response.json()
    return data.hashtags
  }

  static async generateCampaignContent(
    campaignTheme: string,
    duration: number,
    platforms: string[],
    restaurantContext: any,
  ): Promise<AICampaignContent> {
    const response = await fetch("/api/ai/campaign-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignTheme, duration, platforms, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate campaign content")
    }

    const data = await response.json()
    return data.campaign
  }

  static async adaptContentForPlatforms(
    originalContent: string,
    targetPlatforms: string[],
    restaurantContext?: any,
  ): Promise<AIContentVariation> {
    const response = await fetch("/api/ai/content-adaptation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalContent, targetPlatforms, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to adapt content for platforms")
    }

    const data = await response.json()
    return data.variations
  }

  static async generateSeasonalContent(
    season: string,
    occasion: string,
    restaurantContext: any,
  ): Promise<AISeasonalContent> {
    const response = await fetch("/api/ai/seasonal-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ season, occasion, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate seasonal content")
    }

    const data = await response.json()
    return data.seasonalContent
  }

  static async generateImageCaptions(
    imageDescription: string,
    platform: string,
    tone = "engaging",
    restaurantContext?: any,
  ): Promise<{ caption: string; hashtags: string[]; altText: string }> {
    const response = await fetch("/api/ai/image-captions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDescription, platform, tone, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate image captions")
    }

    const data = await response.json()
    return data.caption
  }

  static async generateTrendingContent(trends: string[], restaurantContext: any): Promise<AISocialMediaPost[]> {
    const response = await fetch("/api/ai/trending-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trends, restaurantContext }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate trending content")
    }

    const data = await response.json()
    return data.posts
  }
}

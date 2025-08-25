import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class FacebookBusinessProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Facebook Business",
      type: "marketing",
      authType: "oauth2",
      baseUrl: "https://graph.facebook.com",
      regions: ["US", "CA", "EU", "UK", "AU", "IN", "BR", "MX", "Global"],
      dataTypes: ["campaigns", "ads", "insights", "audiences", "posts"],
      rateLimits: {
        requestsPerMinute: 200,
        requestsPerHour: 4800,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      if (!this.config.credentials.accessToken) {
        return { success: false, error: "Access token required" }
      }

      // Test the access token with a simple request
      const response = await this.makeRequest("GET", "/v18.0/me", {
        access_token: this.config.credentials.accessToken,
      })

      if (response.id) {
        this.accessToken = this.config.credentials.accessToken
        return { success: true, token: this.config.credentials.accessToken }
      }

      return { success: false, error: "Invalid access token" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async fetchData(dataType: DataType): Promise<any> {
    await this.ensureAuthenticated()

    switch (dataType) {
      case "campaigns":
        return this.fetchCampaigns()
      case "ads":
        return this.fetchAds()
      case "insights":
        return this.fetchInsights()
      case "audiences":
        return this.fetchAudiences()
      case "posts":
        return this.fetchPosts()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchCampaigns(): Promise<any> {
    const adAccountId = this.config.credentials.adAccountId
    const response = await this.makeRequest("GET", `/v18.0/act_${adAccountId}/campaigns`, {
      access_token: this.accessToken,
      fields: "id,name,status,objective,created_time,updated_time,start_time,stop_time,budget_remaining,daily_budget",
      limit: 100,
    })

    return this.transformCampaigns(response.data || [])
  }

  private async fetchAds(): Promise<any> {
    const adAccountId = this.config.credentials.adAccountId
    const response = await this.makeRequest("GET", `/v18.0/act_${adAccountId}/ads`, {
      access_token: this.accessToken,
      fields: "id,name,status,creative,campaign_id,adset_id,created_time,updated_time",
      limit: 100,
    })

    return this.transformAds(response.data || [])
  }

  private async fetchInsights(): Promise<any> {
    const adAccountId = this.config.credentials.adAccountId
    const response = await this.makeRequest("GET", `/v18.0/act_${adAccountId}/insights`, {
      access_token: this.accessToken,
      fields: "impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,conversions,cost_per_conversion",
      time_range: JSON.stringify({
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        until: new Date().toISOString().split("T")[0],
      }),
      level: "account",
    })

    return this.transformInsights(response.data || [])
  }

  private async fetchAudiences(): Promise<any> {
    const adAccountId = this.config.credentials.adAccountId
    const response = await this.makeRequest("GET", `/v18.0/act_${adAccountId}/customaudiences`, {
      access_token: this.accessToken,
      fields: "id,name,description,approximate_count,data_source,subtype,created_time,updated_time",
      limit: 100,
    })

    return this.transformAudiences(response.data || [])
  }

  private async fetchPosts(): Promise<any> {
    const pageId = this.config.credentials.pageId
    const response = await this.makeRequest("GET", `/v18.0/${pageId}/posts`, {
      access_token: this.accessToken,
      fields: "id,message,story,created_time,updated_time,likes.summary(true),comments.summary(true),shares",
      limit: 100,
    })

    return this.transformPosts(response.data || [])
  }

  private transformCampaigns(campaigns: any[]): any[] {
    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      objective: campaign.objective,
      dailyBudget: campaign.daily_budget ? Number.parseFloat(campaign.daily_budget) / 100 : null,
      budgetRemaining: campaign.budget_remaining ? Number.parseFloat(campaign.budget_remaining) / 100 : null,
      startTime: campaign.start_time ? new Date(campaign.start_time) : null,
      stopTime: campaign.stop_time ? new Date(campaign.stop_time) : null,
      createdAt: new Date(campaign.created_time),
      updatedAt: new Date(campaign.updated_time),
      source: "facebook-business",
    }))
  }

  private transformAds(ads: any[]): any[] {
    return ads.map((ad) => ({
      id: ad.id,
      name: ad.name,
      status: ad.status,
      campaignId: ad.campaign_id,
      adsetId: ad.adset_id,
      creativeId: ad.creative?.id,
      createdAt: new Date(ad.created_time),
      updatedAt: new Date(ad.updated_time),
      source: "facebook-business",
    }))
  }

  private transformInsights(insights: any[]): any[] {
    return insights.map((insight) => ({
      impressions: Number.parseInt(insight.impressions) || 0,
      clicks: Number.parseInt(insight.clicks) || 0,
      spend: Number.parseFloat(insight.spend) || 0,
      reach: Number.parseInt(insight.reach) || 0,
      frequency: Number.parseFloat(insight.frequency) || 0,
      cpm: Number.parseFloat(insight.cpm) || 0,
      cpc: Number.parseFloat(insight.cpc) || 0,
      ctr: Number.parseFloat(insight.ctr) || 0,
      conversions: Number.parseInt(insight.conversions) || 0,
      costPerConversion: Number.parseFloat(insight.cost_per_conversion) || 0,
      source: "facebook-business",
    }))
  }

  private transformAudiences(audiences: any[]): any[] {
    return audiences.map((audience) => ({
      id: audience.id,
      name: audience.name,
      description: audience.description,
      approximateCount: audience.approximate_count,
      dataSource: audience.data_source,
      subtype: audience.subtype,
      createdAt: new Date(audience.created_time),
      updatedAt: new Date(audience.updated_time),
      source: "facebook-business",
    }))
  }

  private transformPosts(posts: any[]): any[] {
    return posts.map((post) => ({
      id: post.id,
      message: post.message,
      story: post.story,
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      createdAt: new Date(post.created_time),
      updatedAt: new Date(post.updated_time),
      source: "facebook-business",
    }))
  }
}

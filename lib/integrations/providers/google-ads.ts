import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class GoogleAdsProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Google Ads",
      type: "marketing",
      authType: "oauth2",
      baseUrl: "https://googleads.googleapis.com",
      regions: ["US", "CA", "EU", "UK", "AU", "IN", "BR", "MX", "Global"],
      dataTypes: ["campaigns", "ads", "keywords", "analytics", "audiences"],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 10000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      const authUrl = "https://oauth2.googleapis.com/token"

      const response = await this.makeRequest("POST", authUrl, {
        grant_type: "refresh_token",
        client_id: this.config.credentials.clientId,
        client_secret: this.config.credentials.clientSecret,
        refresh_token: this.config.credentials.refreshToken,
      })

      if (response.access_token) {
        this.accessToken = response.access_token
        this.tokenExpiry = new Date(Date.now() + response.expires_in * 1000)
        return { success: true, token: response.access_token }
      }

      return { success: false, error: "Authentication failed" }
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
      case "keywords":
        return this.fetchKeywords()
      case "analytics":
        return this.fetchAnalytics()
      case "audiences":
        return this.fetchAudiences()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchCampaigns(): Promise<any> {
    const customerId = this.config.credentials.customerId
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.start_date,
        campaign.end_date,
        campaign_budget.amount_micros
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY campaign.id
    `

    const response = await this.makeRequest(
      "POST",
      `/v14/customers/${customerId}/googleAds:search`,
      {
        query,
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
        "developer-token": this.config.credentials.developerToken,
        "login-customer-id": this.config.credentials.managerCustomerId,
      },
    )

    return this.transformCampaigns(response.results || [])
  }

  private async fetchAds(): Promise<any> {
    const customerId = this.config.credentials.customerId
    const query = `
      SELECT 
        ad_group_ad.ad.id,
        ad_group_ad.ad.name,
        ad_group_ad.status,
        ad_group_ad.ad.type,
        campaign.id,
        ad_group.id
      FROM ad_group_ad
      WHERE ad_group_ad.status != 'REMOVED'
      ORDER BY ad_group_ad.ad.id
    `

    const response = await this.makeRequest(
      "POST",
      `/v14/customers/${customerId}/googleAds:search`,
      {
        query,
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
        "developer-token": this.config.credentials.developerToken,
        "login-customer-id": this.config.credentials.managerCustomerId,
      },
    )

    return this.transformAds(response.results || [])
  }

  private async fetchKeywords(): Promise<any> {
    const customerId = this.config.credentials.customerId
    const query = `
      SELECT 
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        ad_group_criterion.quality_info.quality_score,
        campaign.id,
        ad_group.id
      FROM keyword_view
      WHERE ad_group_criterion.status != 'REMOVED'
      ORDER BY ad_group_criterion.keyword.text
    `

    const response = await this.makeRequest(
      "POST",
      `/v14/customers/${customerId}/googleAds:search`,
      {
        query,
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
        "developer-token": this.config.credentials.developerToken,
        "login-customer-id": this.config.credentials.managerCustomerId,
      },
    )

    return this.transformKeywords(response.results || [])
  }

  private async fetchAnalytics(): Promise<any> {
    const customerId = this.config.credentials.customerId
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_per_conversion
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
      AND campaign.status != 'REMOVED'
      ORDER BY campaign.id
    `

    const response = await this.makeRequest(
      "POST",
      `/v14/customers/${customerId}/googleAds:search`,
      {
        query,
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
        "developer-token": this.config.credentials.developerToken,
        "login-customer-id": this.config.credentials.managerCustomerId,
      },
    )

    return this.transformAnalytics(response.results || [])
  }

  private async fetchAudiences(): Promise<any> {
    const customerId = this.config.credentials.customerId
    const query = `
      SELECT 
        user_list.id,
        user_list.name,
        user_list.description,
        user_list.membership_life_span,
        user_list.size_for_display,
        user_list.size_for_search
      FROM user_list
      WHERE user_list.closing_reason = 'UNUSED'
      ORDER BY user_list.id
    `

    const response = await this.makeRequest(
      "POST",
      `/v14/customers/${customerId}/googleAds:search`,
      {
        query,
        pageSize: 100,
      },
      {
        Authorization: `Bearer ${this.accessToken}`,
        "developer-token": this.config.credentials.developerToken,
        "login-customer-id": this.config.credentials.managerCustomerId,
      },
    )

    return this.transformAudiences(response.results || [])
  }

  private transformCampaigns(campaigns: any[]): any[] {
    return campaigns.map((result) => ({
      id: result.campaign?.id,
      name: result.campaign?.name,
      status: result.campaign?.status,
      type: result.campaign?.advertisingChannelType,
      budget: result.campaignBudget?.amountMicros ? result.campaignBudget.amountMicros / 1000000 : null,
      startDate: result.campaign?.startDate,
      endDate: result.campaign?.endDate,
      source: "google-ads",
    }))
  }

  private transformAds(ads: any[]): any[] {
    return ads.map((result) => ({
      id: result.adGroupAd?.ad?.id,
      name: result.adGroupAd?.ad?.name,
      status: result.adGroupAd?.status,
      type: result.adGroupAd?.ad?.type,
      campaignId: result.campaign?.id,
      adGroupId: result.adGroup?.id,
      source: "google-ads",
    }))
  }

  private transformKeywords(keywords: any[]): any[] {
    return keywords.map((result) => ({
      text: result.adGroupCriterion?.keyword?.text,
      matchType: result.adGroupCriterion?.keyword?.matchType,
      status: result.adGroupCriterion?.status,
      qualityScore: result.adGroupCriterion?.qualityInfo?.qualityScore,
      campaignId: result.campaign?.id,
      adGroupId: result.adGroup?.id,
      source: "google-ads",
    }))
  }

  private transformAnalytics(analytics: any[]): any[] {
    return analytics.map((result) => ({
      campaignId: result.campaign?.id,
      campaignName: result.campaign?.name,
      impressions: Number.parseInt(result.metrics?.impressions) || 0,
      clicks: Number.parseInt(result.metrics?.clicks) || 0,
      cost: result.metrics?.costMicros ? result.metrics.costMicros / 1000000 : 0,
      conversions: Number.parseFloat(result.metrics?.conversions) || 0,
      ctr: Number.parseFloat(result.metrics?.ctr) || 0,
      averageCpc: result.metrics?.averageCpc ? result.metrics.averageCpc / 1000000 : 0,
      costPerConversion: result.metrics?.costPerConversion ? result.metrics.costPerConversion / 1000000 : 0,
      source: "google-ads",
    }))
  }

  private transformAudiences(audiences: any[]): any[] {
    return audiences.map((result) => ({
      id: result.userList?.id,
      name: result.userList?.name,
      description: result.userList?.description,
      membershipLifeSpan: result.userList?.membershipLifeSpan,
      sizeForDisplay: result.userList?.sizeForDisplay,
      sizeForSearch: result.userList?.sizeForSearch,
      source: "google-ads",
    }))
  }
}

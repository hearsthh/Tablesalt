import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationConfig, DataType, AuthResult } from "../types"

export class MailchimpProvider extends BaseIntegrationProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Mailchimp",
      type: "marketing",
      authType: "api_key",
      baseUrl: `https://${config.credentials.serverPrefix}.api.mailchimp.com/3.0`,
      regions: ["US", "EU", "Global"],
      dataTypes: ["campaigns", "lists", "subscribers", "analytics", "automations"],
      rateLimits: {
        requestsPerMinute: 600,
        requestsPerHour: 10000,
      },
    })
  }

  async authenticate(): Promise<AuthResult> {
    try {
      if (!this.config.credentials.apiKey) {
        return { success: false, error: "API key required" }
      }

      // Test the API key with a simple request
      const response = await this.makeRequest(
        "GET",
        "/",
        {},
        {
          Authorization: `apikey ${this.config.credentials.apiKey}`,
        },
      )

      if (response.account_id) {
        this.accessToken = this.config.credentials.apiKey
        return { success: true, token: this.config.credentials.apiKey }
      }

      return { success: false, error: "Invalid API key" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async fetchData(dataType: DataType): Promise<any> {
    await this.ensureAuthenticated()

    switch (dataType) {
      case "campaigns":
        return this.fetchCampaigns()
      case "lists":
        return this.fetchLists()
      case "subscribers":
        return this.fetchSubscribers()
      case "analytics":
        return this.fetchAnalytics()
      case "automations":
        return this.fetchAutomations()
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private async fetchCampaigns(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/campaigns",
      {
        count: 100,
        status: "sent",
        since_send_time: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        Authorization: `apikey ${this.accessToken}`,
      },
    )

    return this.transformCampaigns(response.campaigns || [])
  }

  private async fetchLists(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/lists",
      {
        count: 100,
      },
      {
        Authorization: `apikey ${this.accessToken}`,
      },
    )

    return this.transformLists(response.lists || [])
  }

  private async fetchSubscribers(): Promise<any> {
    const lists = await this.fetchLists()
    const allSubscribers = []

    for (const list of lists.slice(0, 5)) {
      // Limit to first 5 lists to avoid rate limits
      const response = await this.makeRequest(
        "GET",
        `/lists/${list.id}/members`,
        {
          count: 100,
          status: "subscribed",
        },
        {
          Authorization: `apikey ${this.accessToken}`,
        },
      )

      const subscribers = this.transformSubscribers(response.members || [], list.id)
      allSubscribers.push(...subscribers)
    }

    return allSubscribers
  }

  private async fetchAnalytics(): Promise<any> {
    const campaigns = await this.fetchCampaigns()
    const analytics = []

    for (const campaign of campaigns.slice(0, 10)) {
      // Limit to recent campaigns
      const response = await this.makeRequest(
        "GET",
        `/reports/${campaign.id}`,
        {},
        {
          Authorization: `apikey ${this.accessToken}`,
        },
      )

      analytics.push(this.transformCampaignAnalytics(response, campaign.id))
    }

    return analytics
  }

  private async fetchAutomations(): Promise<any> {
    const response = await this.makeRequest(
      "GET",
      "/automations",
      {
        count: 100,
      },
      {
        Authorization: `apikey ${this.accessToken}`,
      },
    )

    return this.transformAutomations(response.automations || [])
  }

  private transformCampaigns(campaigns: any[]): any[] {
    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.settings?.title,
      subject: campaign.settings?.subject_line,
      status: campaign.status,
      type: campaign.type,
      emailsSent: campaign.emails_sent,
      sendTime: campaign.send_time ? new Date(campaign.send_time) : null,
      createdAt: new Date(campaign.create_time),
      source: "mailchimp",
    }))
  }

  private transformLists(lists: any[]): any[] {
    return lists.map((list) => ({
      id: list.id,
      name: list.name,
      memberCount: list.stats?.member_count || 0,
      subscribedCount: list.stats?.member_count_since_send || 0,
      unsubscribeCount: list.stats?.unsubscribe_count || 0,
      cleanedCount: list.stats?.cleaned_count || 0,
      avgSubscribeRate: list.stats?.avg_sub_rate || 0,
      avgUnsubscribeRate: list.stats?.avg_unsub_rate || 0,
      createdAt: new Date(list.date_created),
      source: "mailchimp",
    }))
  }

  private transformSubscribers(subscribers: any[], listId: string): any[] {
    return subscribers.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email_address,
      status: subscriber.status,
      firstName: subscriber.merge_fields?.FNAME,
      lastName: subscriber.merge_fields?.LNAME,
      listId,
      subscribeDate: new Date(subscriber.timestamp_signup),
      lastChanged: new Date(subscriber.last_changed),
      source: "mailchimp",
    }))
  }

  private transformCampaignAnalytics(analytics: any, campaignId: string): any {
    return {
      campaignId,
      emailsSent: analytics.emails_sent || 0,
      opens: analytics.opens?.opens_total || 0,
      uniqueOpens: analytics.opens?.unique_opens || 0,
      openRate: analytics.opens?.open_rate || 0,
      clicks: analytics.clicks?.clicks_total || 0,
      uniqueClicks: analytics.clicks?.unique_clicks || 0,
      clickRate: analytics.clicks?.click_rate || 0,
      subscriberClicks: analytics.clicks?.subscriber_clicks || 0,
      unsubscribes: analytics.unsubscribed?.unsubscribes || 0,
      unsubscribeRate: analytics.unsubscribed?.unsubscribe_rate || 0,
      bounces: analytics.bounces?.hard_bounces + analytics.bounces?.soft_bounces || 0,
      bounceRate: analytics.bounces?.bounce_rate || 0,
      source: "mailchimp",
    }
  }

  private transformAutomations(automations: any[]): any[] {
    return automations.map((automation) => ({
      id: automation.id,
      name: automation.settings?.title,
      status: automation.status,
      emailsSent: automation.emails_sent,
      recipients: automation.recipients?.list_name,
      createdAt: new Date(automation.create_time),
      startTime: automation.start_time ? new Date(automation.start_time) : null,
      source: "mailchimp",
    }))
  }
}

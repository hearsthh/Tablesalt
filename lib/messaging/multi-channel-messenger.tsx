import { emailAutomation } from "../automation/email-automation"
import { WhatsAppBusinessProvider } from "../integrations/providers/whatsapp-business"
import { socialMediaScheduler } from "../scheduling/social-media-scheduler"

export interface MessageChannel {
  id: string
  name: string
  type: "email" | "sms" | "whatsapp" | "facebook" | "instagram" | "twitter" | "push"
  provider: string
  enabled: boolean
  config: Record<string, any>
  rateLimits: {
    requests: number
    window: number // milliseconds
  }
}

export interface MessageTemplate {
  id: string
  name: string
  channels: string[]
  content: {
    [channelType: string]: {
      subject?: string
      text: string
      html?: string
      media?: string[]
    }
  }
  variables: string[]
  category: "transactional" | "marketing" | "notification" | "automation"
  createdAt: string
  updatedAt: string
}

export interface MessageRecipient {
  id: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  social_handles?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  preferences: {
    channels: string[]
    frequency: "immediate" | "daily" | "weekly"
    categories: string[]
  }
  segments: string[]
  lastContactedAt?: string
}

export interface MessageCampaign {
  id: string
  name: string
  templateId: string
  channels: string[]
  recipients: MessageRecipient[]
  variables: Record<string, string>
  scheduledAt?: string
  sentAt?: string
  status: "draft" | "scheduled" | "sending" | "sent" | "failed" | "paused"
  metrics: {
    [channel: string]: {
      sent: number
      delivered: number
      opened?: number
      clicked?: number
      replied?: number
      failed: number
    }
  }
  settings: {
    respectPreferences: boolean
    fallbackChannels: boolean
    maxRetries: number
    retryDelay: number
  }
}

export interface MessageFlow {
  id: string
  name: string
  trigger: {
    type: "event" | "time" | "condition"
    config: Record<string, any>
  }
  steps: MessageFlowStep[]
  enabled: boolean
  createdAt: string
}

export interface MessageFlowStep {
  id: string
  type: "message" | "delay" | "condition" | "action"
  config: {
    templateId?: string
    channels?: string[]
    delay?: number
    condition?: string
    action?: string
  }
  nextSteps: string[]
}

class MultiChannelMessenger {
  private channels: Map<string, MessageChannel> = new Map()
  private templates: Map<string, MessageTemplate> = new Map()
  private recipients: Map<string, MessageRecipient> = new Map()
  private campaigns: Map<string, MessageCampaign> = new Map()
  private flows: Map<string, MessageFlow> = new Map()
  private providers: Map<string, any> = new Map()
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log("[v0] Initializing multi-channel messenger...")

    // Setup default channels
    this.setupDefaultChannels()

    // Setup default templates
    this.setupDefaultTemplates()

    // Initialize providers
    await this.initializeProviders()

    // Setup default message flows
    this.setupDefaultFlows()

    this.isInitialized = true
    console.log("[v0] Multi-channel messenger initialized")
  }

  private setupDefaultChannels(): void {
    const defaultChannels: MessageChannel[] = [
      {
        id: "email",
        name: "Email",
        type: "email",
        provider: "sendgrid",
        enabled: true,
        config: { apiKey: "mock_key" },
        rateLimits: { requests: 1000, window: 3600000 },
      },
      {
        id: "sms",
        name: "SMS",
        type: "sms",
        provider: "twilio",
        enabled: true,
        config: { accountSid: "mock_sid", authToken: "mock_token" },
        rateLimits: { requests: 100, window: 3600000 },
      },
      {
        id: "whatsapp",
        name: "WhatsApp Business",
        type: "whatsapp",
        provider: "whatsapp_business",
        enabled: true,
        config: { accessToken: "mock_token" },
        rateLimits: { requests: 1000, window: 3600000 },
      },
      {
        id: "facebook",
        name: "Facebook Messenger",
        type: "facebook",
        provider: "facebook_business",
        enabled: true,
        config: { accessToken: "mock_token" },
        rateLimits: { requests: 200, window: 3600000 },
      },
      {
        id: "push",
        name: "Push Notifications",
        type: "push",
        provider: "firebase",
        enabled: true,
        config: { serverKey: "mock_key" },
        rateLimits: { requests: 10000, window: 3600000 },
      },
    ]

    defaultChannels.forEach((channel) => {
      this.channels.set(channel.id, channel)
    })
  }

  private setupDefaultTemplates(): void {
    const defaultTemplates: MessageTemplate[] = [
      {
        id: "welcome_multichannel",
        name: "Welcome Message (Multi-Channel)",
        channels: ["email", "sms", "whatsapp"],
        content: {
          email: {
            subject: "Welcome to {{restaurantName}}!",
            html: `
              <h1>Welcome to {{restaurantName}}!</h1>
              <p>Hi {{customerName}},</p>
              <p>Thank you for joining us! We're excited to serve you delicious meals.</p>
              <p>Here's a special 10% discount for your first order: <strong>WELCOME10</strong></p>
              <p>Best regards,<br>The {{restaurantName}} Team</p>
            `,
            text: "Welcome to {{restaurantName}}! Hi {{customerName}}, thank you for joining us! Use code WELCOME10 for 10% off your first order.",
          },
          sms: {
            text: "Welcome to {{restaurantName}}, {{customerName}}! Use code WELCOME10 for 10% off your first order. Reply STOP to opt out.",
          },
          whatsapp: {
            text: "🎉 Welcome to {{restaurantName}}, {{customerName}}! We're excited to serve you. Use code WELCOME10 for 10% off your first order!",
          },
        },
        variables: ["restaurantName", "customerName"],
        category: "transactional",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "order_update_multichannel",
        name: "Order Update (Multi-Channel)",
        channels: ["email", "sms", "whatsapp", "push"],
        content: {
          email: {
            subject: "Order Update - {{orderNumber}}",
            html: `
              <h1>Order Update</h1>
              <p>Hi {{customerName}},</p>
              <p>Your order #{{orderNumber}} is {{orderStatus}}.</p>
              <p>{{statusMessage}}</p>
              <p>Thank you for choosing {{restaurantName}}!</p>
            `,
            text: "Hi {{customerName}}, your order #{{orderNumber}} is {{orderStatus}}. {{statusMessage}}",
          },
          sms: {
            text: "{{restaurantName}}: Order #{{orderNumber}} is {{orderStatus}}. {{statusMessage}}",
          },
          whatsapp: {
            text: "📦 Order Update from {{restaurantName}}\n\nHi {{customerName}}! Your order #{{orderNumber}} is {{orderStatus}}.\n\n{{statusMessage}}",
          },
          push: {
            text: "Order #{{orderNumber}} is {{orderStatus}}",
          },
        },
        variables: ["customerName", "orderNumber", "orderStatus", "statusMessage", "restaurantName"],
        category: "transactional",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "promotional_multichannel",
        name: "Promotional Message (Multi-Channel)",
        channels: ["email", "sms", "whatsapp", "facebook", "instagram"],
        content: {
          email: {
            subject: "{{promoTitle}} - {{restaurantName}}",
            html: `
              <h1>{{promoTitle}}</h1>
              <p>Hi {{customerName}},</p>
              <p>{{promoDescription}}</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="{{ctaLink}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">{{ctaText}}</a>
              </div>
              <p>Valid until: {{expiryDate}}</p>
            `,
            text: "{{promoTitle}} - {{promoDescription}} {{ctaText}}: {{ctaLink}} Valid until: {{expiryDate}}",
          },
          sms: {
            text: "{{restaurantName}}: {{promoTitle}} - {{promoDescription}} {{ctaLink}} Valid until {{expiryDate}}. Reply STOP to opt out.",
          },
          whatsapp: {
            text: "🎉 {{promoTitle}}\n\nHi {{customerName}}!\n\n{{promoDescription}}\n\n{{ctaText}}: {{ctaLink}}\n\nValid until: {{expiryDate}}",
          },
          facebook: {
            text: "{{promoTitle}} 🍽️\n\n{{promoDescription}}\n\n{{ctaText}}: {{ctaLink}}\n\nValid until: {{expiryDate}}\n\n#{{restaurantName}} #FoodPromo",
          },
          instagram: {
            text: "{{promoTitle}} 🍽️\n\n{{promoDescription}}\n\n{{ctaText}}: {{ctaLink}}\n\nValid until: {{expiryDate}}\n\n#{{restaurantName}} #FoodPromo #Delicious",
          },
        },
        variables: [
          "customerName",
          "promoTitle",
          "promoDescription",
          "ctaText",
          "ctaLink",
          "expiryDate",
          "restaurantName",
        ],
        category: "marketing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    defaultTemplates.forEach((template) => {
      this.templates.set(template.id, template)
    })
  }

  private async initializeProviders(): Promise<void> {
    // Initialize WhatsApp provider
    const whatsappProvider = new WhatsAppBusinessProvider({
      name: "WhatsApp Business",
      credentials: { accessToken: "mock_token" },
      baseUrl: "https://graph.facebook.com/v18.0",
    })
    this.providers.set("whatsapp_business", whatsappProvider)

    // Mock other providers
    this.providers.set("sendgrid", { send: async (data: any) => console.log("[v0] SendGrid email sent:", data) })
    this.providers.set("twilio", { send: async (data: any) => console.log("[v0] Twilio SMS sent:", data) })
    this.providers.set("firebase", { send: async (data: any) => console.log("[v0] Firebase push sent:", data) })
  }

  private setupDefaultFlows(): void {
    const defaultFlows: MessageFlow[] = [
      {
        id: "customer_onboarding",
        name: "Customer Onboarding Flow",
        trigger: {
          type: "event",
          config: { event: "customer_registered" },
        },
        steps: [
          {
            id: "welcome_message",
            type: "message",
            config: {
              templateId: "welcome_multichannel",
              channels: ["email", "sms"],
            },
            nextSteps: ["delay_1"],
          },
          {
            id: "delay_1",
            type: "delay",
            config: { delay: 24 * 60 * 60 * 1000 }, // 24 hours
            nextSteps: ["follow_up"],
          },
          {
            id: "follow_up",
            type: "message",
            config: {
              templateId: "promotional_multichannel",
              channels: ["email"],
            },
            nextSteps: [],
          },
        ],
        enabled: true,
        createdAt: new Date().toISOString(),
      },
    ]

    defaultFlows.forEach((flow) => {
      this.flows.set(flow.id, flow)
    })
  }

  async sendMessage(
    templateId: string,
    recipients: MessageRecipient[],
    variables: Record<string, string>,
    channels?: string[],
  ): Promise<{
    success: { recipient: MessageRecipient; channel: string; messageId: string }[]
    failed: { recipient: MessageRecipient; channel: string; error: string }[]
  }> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const targetChannels = channels || template.channels
    const results = {
      success: [] as { recipient: MessageRecipient; channel: string; messageId: string }[],
      failed: [] as { recipient: MessageRecipient; channel: string; error: string }[],
    }

    for (const recipient of recipients) {
      for (const channelId of targetChannels) {
        try {
          // Check recipient preferences
          if (!recipient.preferences.channels.includes(channelId)) {
            continue
          }

          const channel = this.channels.get(channelId)
          if (!channel || !channel.enabled) {
            continue
          }

          const messageId = await this.sendToChannel(channel, template, recipient, variables)
          results.success.push({ recipient, channel: channelId, messageId })
        } catch (error) {
          results.failed.push({
            recipient,
            channel: channelId,
            error: error.message,
          })
        }
      }
    }

    console.log(
      `[v0] Multi-channel message sent: ${results.success.length} successful, ${results.failed.length} failed`,
    )
    return results
  }

  private async sendToChannel(
    channel: MessageChannel,
    template: MessageTemplate,
    recipient: MessageRecipient,
    variables: Record<string, string>,
  ): Promise<string> {
    const content = template.content[channel.type]
    if (!content) {
      throw new Error(`No content defined for channel type: ${channel.type}`)
    }

    // Replace variables in content
    const processedContent = { ...content }
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      if (processedContent.text) {
        processedContent.text = processedContent.text.replace(new RegExp(placeholder, "g"), value)
      }
      if (processedContent.html) {
        processedContent.html = processedContent.html.replace(new RegExp(placeholder, "g"), value)
      }
      if (processedContent.subject) {
        processedContent.subject = processedContent.subject.replace(new RegExp(placeholder, "g"), value)
      }
    })

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    switch (channel.type) {
      case "email":
        if (!recipient.email) throw new Error("No email address for recipient")
        await emailAutomation.sendEmail("welcome", recipient.email, variables)
        break

      case "sms":
        if (!recipient.phone) throw new Error("No phone number for recipient")
        const smsProvider = this.providers.get(channel.provider)
        await smsProvider.send({
          to: recipient.phone,
          body: processedContent.text,
        })
        break

      case "whatsapp":
        if (!recipient.whatsapp) throw new Error("No WhatsApp number for recipient")
        const whatsappProvider = this.providers.get(channel.provider)
        await whatsappProvider.sendMessage({
          to: recipient.whatsapp,
          type: "text",
          content: { body: processedContent.text },
        })
        break

      case "facebook":
      case "instagram":
        // For social media, we'd typically use the social media scheduler
        await socialMediaScheduler.schedulePost({
          restaurantId: "default",
          platforms: [channel.type],
          content: {
            text: processedContent.text,
            media_urls: processedContent.media,
          },
          scheduledTime: new Date().toISOString(),
          timezone: "UTC",
        })
        break

      case "push":
        const pushProvider = this.providers.get(channel.provider)
        await pushProvider.send({
          to: recipient.id,
          title: variables.restaurantName || "Notification",
          body: processedContent.text,
        })
        break

      default:
        throw new Error(`Unsupported channel type: ${channel.type}`)
    }

    console.log(`[v0] Message sent via ${channel.name} to ${recipient.name}`)
    return messageId
  }

  async createCampaign(campaign: Omit<MessageCampaign, "id" | "metrics">): Promise<string> {
    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newCampaign: MessageCampaign = {
      ...campaign,
      id: campaignId,
      metrics: {},
    }

    // Initialize metrics for each channel
    campaign.channels.forEach((channelId) => {
      newCampaign.metrics[channelId] = {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        failed: 0,
      }
    })

    this.campaigns.set(campaignId, newCampaign)
    console.log(`[v0] Multi-channel campaign created: ${campaign.name}`)
    return campaignId
  }

  async executeCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`)
    }

    campaign.status = "sending"
    console.log(`[v0] Executing multi-channel campaign: ${campaign.name}`)

    const results = await this.sendMessage(
      campaign.templateId,
      campaign.recipients,
      campaign.variables,
      campaign.channels,
    )

    // Update metrics
    results.success.forEach(({ channel }) => {
      campaign.metrics[channel].sent++
      campaign.metrics[channel].delivered++
    })

    results.failed.forEach(({ channel }) => {
      campaign.metrics[channel].failed++
    })

    campaign.status = "sent"
    campaign.sentAt = new Date().toISOString()
    console.log(`[v0] Campaign completed: ${campaign.name}`)
  }

  async addRecipient(recipient: Omit<MessageRecipient, "id">): Promise<string> {
    const recipientId = `recipient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newRecipient: MessageRecipient = {
      ...recipient,
      id: recipientId,
    }

    this.recipients.set(recipientId, newRecipient)
    console.log(`[v0] Recipient added: ${recipient.name}`)
    return recipientId
  }

  async segmentRecipients(criteria: {
    segments?: string[]
    channels?: string[]
    lastContactedBefore?: string
    preferences?: Partial<MessageRecipient["preferences"]>
  }): Promise<MessageRecipient[]> {
    let recipients = Array.from(this.recipients.values())

    if (criteria.segments) {
      recipients = recipients.filter((r) => criteria.segments!.some((segment) => r.segments.includes(segment)))
    }

    if (criteria.channels) {
      recipients = recipients.filter((r) =>
        criteria.channels!.some((channel) => r.preferences.channels.includes(channel)),
      )
    }

    if (criteria.lastContactedBefore) {
      const beforeDate = new Date(criteria.lastContactedBefore)
      recipients = recipients.filter((r) => !r.lastContactedAt || new Date(r.lastContactedAt) < beforeDate)
    }

    console.log(`[v0] Segmented ${recipients.length} recipients based on criteria`)
    return recipients
  }

  async triggerFlow(flowId: string, recipient: MessageRecipient, variables: Record<string, string>): Promise<void> {
    const flow = this.flows.get(flowId)
    if (!flow || !flow.enabled) {
      throw new Error(`Flow ${flowId} not found or disabled`)
    }

    console.log(`[v0] Triggering flow: ${flow.name} for ${recipient.name}`)

    // Execute first step
    const firstStep = flow.steps[0]
    if (firstStep) {
      await this.executeFlowStep(firstStep, flow, recipient, variables)
    }
  }

  private async executeFlowStep(
    step: MessageFlowStep,
    flow: MessageFlow,
    recipient: MessageRecipient,
    variables: Record<string, string>,
  ): Promise<void> {
    console.log(`[v0] Executing flow step: ${step.type}`)

    switch (step.type) {
      case "message":
        if (step.config.templateId && step.config.channels) {
          await this.sendMessage(step.config.templateId, [recipient], variables, step.config.channels)
        }
        break

      case "delay":
        if (step.config.delay) {
          setTimeout(() => {
            step.nextSteps.forEach((nextStepId) => {
              const nextStep = flow.steps.find((s) => s.id === nextStepId)
              if (nextStep) {
                this.executeFlowStep(nextStep, flow, recipient, variables)
              }
            })
          }, step.config.delay)
          return // Don't execute next steps immediately
        }
        break

      case "condition":
        // Mock condition evaluation
        const conditionMet = Math.random() > 0.5
        if (conditionMet) {
          console.log(`[v0] Condition met, continuing flow`)
        } else {
          console.log(`[v0] Condition not met, skipping steps`)
          return
        }
        break

      case "action":
        console.log(`[v0] Executing action: ${step.config.action}`)
        break
    }

    // Execute next steps
    step.nextSteps.forEach((nextStepId) => {
      const nextStep = flow.steps.find((s) => s.id === nextStepId)
      if (nextStep) {
        this.executeFlowStep(nextStep, flow, recipient, variables)
      }
    })
  }

  // Management methods
  getChannels(): MessageChannel[] {
    return Array.from(this.channels.values())
  }

  getTemplates(): MessageTemplate[] {
    return Array.from(this.templates.values())
  }

  getRecipients(): MessageRecipient[] {
    return Array.from(this.recipients.values())
  }

  getCampaigns(): MessageCampaign[] {
    return Array.from(this.campaigns.values())
  }

  getFlows(): MessageFlow[] {
    return Array.from(this.flows.values())
  }

  getCampaignMetrics(campaignId: string): MessageCampaign["metrics"] | null {
    const campaign = this.campaigns.get(campaignId)
    return campaign?.metrics || null
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      channels: this.channels.size,
      templates: this.templates.size,
      recipients: this.recipients.size,
      campaigns: this.campaigns.size,
      flows: this.flows.size,
      enabledChannels: Array.from(this.channels.values()).filter((c) => c.enabled).length,
    }
  }
}

export const multiChannelMessenger = new MultiChannelMessenger()

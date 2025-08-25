interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

interface EmailCampaign {
  id: string
  name: string
  templateId: string
  recipients: string[]
  scheduledAt?: string
  sentAt?: string
  status: "draft" | "scheduled" | "sending" | "sent" | "failed"
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
  }
}

class EmailAutomation {
  private templates: Map<string, EmailTemplate> = new Map()
  private campaigns: Map<string, EmailCampaign> = new Map()

  constructor() {
    this.setupDefaultTemplates()
  }

  private setupDefaultTemplates() {
    // Welcome email template
    this.addTemplate({
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to {{restaurantName}}!",
      htmlContent: `
        <h1>Welcome to {{restaurantName}}!</h1>
        <p>Hi {{customerName}},</p>
        <p>Thank you for joining us! We're excited to serve you delicious meals.</p>
        <p>Here's a special 10% discount for your first order: <strong>WELCOME10</strong></p>
        <p>Best regards,<br>The {{restaurantName}} Team</p>
      `,
      textContent: `
        Welcome to {{restaurantName}}!
        
        Hi {{customerName}},
        
        Thank you for joining us! We're excited to serve you delicious meals.
        
        Here's a special 10% discount for your first order: WELCOME10
        
        Best regards,
        The {{restaurantName}} Team
      `,
      variables: ["restaurantName", "customerName"],
    })

    // Order confirmation template
    this.addTemplate({
      id: "order-confirmation",
      name: "Order Confirmation",
      subject: "Order Confirmed - {{orderNumber}}",
      htmlContent: `
        <h1>Order Confirmed!</h1>
        <p>Hi {{customerName}},</p>
        <p>Your order #{{orderNumber}} has been confirmed and is being prepared.</p>
        <div>
          <h3>Order Details:</h3>
          {{orderItems}}
          <p><strong>Total: ${{ orderTotal }}</strong></p>
        </div>
        <p>Estimated delivery time: {{estimatedTime}}</p>
        <p>Thank you for choosing {{restaurantName}}!</p>
      `,
      textContent: `
        Order Confirmed!
        
        Hi {{customerName}},
        
        Your order #{{orderNumber}} has been confirmed and is being prepared.
        
        Order Details:
        {{orderItems}}
        Total: ${{ orderTotal }}
        
        Estimated delivery time: {{estimatedTime}}
        
        Thank you for choosing {{restaurantName}}!
      `,
      variables: ["customerName", "orderNumber", "orderItems", "orderTotal", "estimatedTime", "restaurantName"],
    })

    // Review request template
    this.addTemplate({
      id: "review-request",
      name: "Review Request",
      subject: "How was your meal at {{restaurantName}}?",
      htmlContent: `
        <h1>We'd love your feedback!</h1>
        <p>Hi {{customerName}},</p>
        <p>Thank you for dining with us recently. We hope you enjoyed your meal!</p>
        <p>Would you mind taking a moment to share your experience?</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="{{reviewLink}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Leave a Review</a>
        </div>
        <p>Your feedback helps us improve and serve you better.</p>
        <p>Best regards,<br>The {{restaurantName}} Team</p>
      `,
      textContent: `
        We'd love your feedback!
        
        Hi {{customerName}},
        
        Thank you for dining with us recently. We hope you enjoyed your meal!
        
        Would you mind taking a moment to share your experience?
        
        Leave a review: {{reviewLink}}
        
        Your feedback helps us improve and serve you better.
        
        Best regards,
        The {{restaurantName}} Team
      `,
      variables: ["customerName", "reviewLink", "restaurantName"],
    })

    // Loyalty reward template
    this.addTemplate({
      id: "loyalty-reward",
      name: "Loyalty Reward",
      subject: "You've earned a reward at {{restaurantName}}!",
      htmlContent: `
        <h1>Congratulations!</h1>
        <p>Hi {{customerName}},</p>
        <p>You've been a loyal customer, and we want to thank you!</p>
        <p>You've earned: <strong>{{rewardDescription}}</strong></p>
        <p>Use code: <strong>{{rewardCode}}</strong></p>
        <p>Valid until: {{expiryDate}}</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="{{orderLink}}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Order Now</a>
        </div>
        <p>Thank you for being a valued customer!</p>
      `,
      textContent: `
        Congratulations!
        
        Hi {{customerName}},
        
        You've been a loyal customer, and we want to thank you!
        
        You've earned: {{rewardDescription}}
        Use code: {{rewardCode}}
        Valid until: {{expiryDate}}
        
        Order now: {{orderLink}}
        
        Thank you for being a valued customer!
      `,
      variables: ["customerName", "rewardDescription", "rewardCode", "expiryDate", "orderLink"],
    })
  }

  addTemplate(template: EmailTemplate) {
    this.templates.set(template.id, template)
  }

  async sendEmail(templateId: string, recipient: string, variables: Record<string, string>): Promise<boolean> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    console.log(`[v0] Sending email: ${template.name} to ${recipient}`)

    // Replace variables in template
    let htmlContent = template.htmlContent
    let textContent = template.textContent
    let subject = template.subject

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      htmlContent = htmlContent.replace(new RegExp(placeholder, "g"), value)
      textContent = textContent.replace(new RegExp(placeholder, "g"), value)
      subject = subject.replace(new RegExp(placeholder, "g"), value)
    })

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In production, this would use a real email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Postmark

    console.log(`[v0] Email sent successfully to ${recipient}`)
    console.log(`[v0] Subject: ${subject}`)

    return true
  }

  async createCampaign(campaign: Omit<EmailCampaign, "id" | "metrics">): Promise<string> {
    const id = `campaign-${Date.now()}`
    const newCampaign: EmailCampaign = {
      ...campaign,
      id,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
      },
    }

    this.campaigns.set(id, newCampaign)
    console.log(`[v0] Campaign created: ${campaign.name}`)

    return id
  }

  async sendCampaign(campaignId: string, variables: Record<string, string>): Promise<void> {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`)
    }

    campaign.status = "sending"
    console.log(`[v0] Starting campaign: ${campaign.name}`)

    for (const recipient of campaign.recipients) {
      try {
        await this.sendEmail(campaign.templateId, recipient, {
          ...variables,
          customerName: recipient.split("@")[0], // Mock customer name from email
        })
        campaign.metrics.sent++
        campaign.metrics.delivered++
      } catch (error) {
        console.error(`[v0] Failed to send email to ${recipient}:`, error)
        campaign.metrics.bounced++
      }

      // Small delay between emails
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    campaign.status = "sent"
    campaign.sentAt = new Date().toISOString()
    console.log(`[v0] Campaign completed: ${campaign.name}`)
  }

  // Automation triggers
  async triggerWelcomeEmail(customerEmail: string, customerName: string, restaurantName: string) {
    return this.sendEmail("welcome", customerEmail, {
      customerName,
      restaurantName,
    })
  }

  async triggerOrderConfirmation(
    customerEmail: string,
    orderData: {
      customerName: string
      orderNumber: string
      orderItems: string
      orderTotal: string
      estimatedTime: string
      restaurantName: string
    },
  ) {
    return this.sendEmail("order-confirmation", customerEmail, orderData)
  }

  async triggerReviewRequest(customerEmail: string, customerName: string, restaurantName: string, reviewLink: string) {
    return this.sendEmail("review-request", customerEmail, {
      customerName,
      restaurantName,
      reviewLink,
    })
  }

  async triggerLoyaltyReward(
    customerEmail: string,
    rewardData: {
      customerName: string
      rewardDescription: string
      rewardCode: string
      expiryDate: string
      orderLink: string
    },
  ) {
    return this.sendEmail("loyalty-reward", customerEmail, rewardData)
  }

  getTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values())
  }

  getCampaigns(): EmailCampaign[] {
    return Array.from(this.campaigns.values())
  }
}

export const emailAutomation = new EmailAutomation()

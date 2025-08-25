import type { Alert, IntegrationHealth } from "./integration-monitor"

export interface NotificationChannel {
  id: string
  name: string
  type: "email" | "slack" | "webhook" | "sms"
  config: Record<string, any>
  enabled: boolean
  severityFilter: Array<"low" | "medium" | "high" | "critical">
}

export interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

export class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map()
  private templates: Map<string, NotificationTemplate> = new Map()
  private notificationHistory: Array<{
    id: string
    channelId: string
    alertId: string
    timestamp: Date
    success: boolean
    error?: string
  }> = []

  constructor() {
    this.initializeDefaultTemplates()
  }

  // Channel management
  addChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel)
  }

  removeChannel(channelId: string): void {
    this.channels.delete(channelId)
  }

  getChannels(): NotificationChannel[] {
    return Array.from(this.channels.values())
  }

  // Template management
  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template)
  }

  getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values())
  }

  // Send notifications for alerts
  async sendAlertNotification(alert: Alert, health: IntegrationHealth): Promise<void> {
    const eligibleChannels = this.getEligibleChannels(alert.severity)

    for (const channel of eligibleChannels) {
      try {
        await this.sendNotification(channel, alert, health)
        this.recordNotificationHistory(channel.id, alert.id, true)
      } catch (error) {
        console.error(`Failed to send notification via ${channel.name}:`, error)
        this.recordNotificationHistory(channel.id, alert.id, false, error.message)
      }
    }
  }

  // Send custom notifications
  async sendCustomNotification(channelId: string, subject: string, message: string): Promise<boolean> {
    const channel = this.channels.get(channelId)
    if (!channel || !channel.enabled) {
      return false
    }

    try {
      await this.sendRawNotification(channel, subject, message)
      return true
    } catch (error) {
      console.error(`Failed to send custom notification:`, error)
      return false
    }
  }

  // Get notification history
  getNotificationHistory(limit = 100): Array<{
    id: string
    channelId: string
    alertId: string
    timestamp: Date
    success: boolean
    error?: string
  }> {
    return this.notificationHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  }

  // Private methods
  private getEligibleChannels(severity: Alert["severity"]): NotificationChannel[] {
    return Array.from(this.channels.values()).filter(
      (channel) => channel.enabled && channel.severityFilter.includes(severity),
    )
  }

  private async sendNotification(channel: NotificationChannel, alert: Alert, health: IntegrationHealth): Promise<void> {
    const template = this.templates.get("alert-notification")
    if (!template) {
      throw new Error("Alert notification template not found")
    }

    const subject = this.renderTemplate(template.subject, { alert, health })
    const body = this.renderTemplate(template.body, { alert, health })

    await this.sendRawNotification(channel, subject, body)
  }

  private async sendRawNotification(channel: NotificationChannel, subject: string, message: string): Promise<void> {
    switch (channel.type) {
      case "email":
        await this.sendEmailNotification(channel, subject, message)
        break
      case "slack":
        await this.sendSlackNotification(channel, subject, message)
        break
      case "webhook":
        await this.sendWebhookNotification(channel, subject, message)
        break
      case "sms":
        await this.sendSMSNotification(channel, message)
        break
      default:
        throw new Error(`Unsupported notification channel type: ${channel.type}`)
    }
  }

  private async sendEmailNotification(channel: NotificationChannel, subject: string, message: string): Promise<void> {
    // Mock email sending - in real implementation, use email service
    console.log(`📧 Email notification sent to ${channel.config.email}:`, { subject, message })
  }

  private async sendSlackNotification(channel: NotificationChannel, subject: string, message: string): Promise<void> {
    // Mock Slack notification - in real implementation, use Slack API
    const payload = {
      text: subject,
      attachments: [
        {
          color: "danger",
          text: message,
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }

    console.log(`💬 Slack notification sent to ${channel.config.webhook}:`, payload)
  }

  private async sendWebhookNotification(channel: NotificationChannel, subject: string, message: string): Promise<void> {
    // Mock webhook notification - in real implementation, make HTTP request
    const payload = {
      subject,
      message,
      timestamp: new Date().toISOString(),
      source: "tablesalt-monitoring",
    }

    console.log(`🔗 Webhook notification sent to ${channel.config.url}:`, payload)
  }

  private async sendSMSNotification(channel: NotificationChannel, message: string): Promise<void> {
    // Mock SMS notification - in real implementation, use SMS service
    console.log(`📱 SMS notification sent to ${channel.config.phoneNumber}:`, message)
  }

  private renderTemplate(template: string, variables: { alert: Alert; health: IntegrationHealth }): string {
    let rendered = template

    // Replace variables in template
    rendered = rendered.replace(/\{\{alert\.severity\}\}/g, variables.alert.severity)
    rendered = rendered.replace(/\{\{alert\.message\}\}/g, variables.alert.message)
    rendered = rendered.replace(/\{\{alert\.timestamp\}\}/g, variables.alert.timestamp.toISOString())
    rendered = rendered.replace(/\{\{health\.providerName\}\}/g, variables.health.providerName)
    rendered = rendered.replace(/\{\{health\.status\}\}/g, variables.health.status)
    rendered = rendered.replace(/\{\{health\.responseTime\}\}/g, variables.health.responseTime.toString())
    rendered = rendered.replace(/\{\{health\.errorRate\}\}/g, variables.health.errorRate.toString())

    return rendered
  }

  private recordNotificationHistory(channelId: string, alertId: string, success: boolean, error?: string): void {
    this.notificationHistory.push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      alertId,
      timestamp: new Date(),
      success,
      error,
    })

    // Keep only last 1000 notifications
    if (this.notificationHistory.length > 1000) {
      this.notificationHistory = this.notificationHistory.slice(-1000)
    }
  }

  private initializeDefaultTemplates(): void {
    const alertTemplate: NotificationTemplate = {
      id: "alert-notification",
      name: "Alert Notification",
      subject: "🚨 {{alert.severity}} Alert: {{health.providerName}}",
      body: `
Alert Details:
- Provider: {{health.providerName}}
- Severity: {{alert.severity}}
- Status: {{health.status}}
- Message: {{alert.message}}
- Response Time: {{health.responseTime}}ms
- Error Rate: {{health.errorRate}}%
- Timestamp: {{alert.timestamp}}

Please investigate and resolve this issue as soon as possible.
      `.trim(),
      variables: [
        "alert.severity",
        "alert.message",
        "alert.timestamp",
        "health.providerName",
        "health.status",
        "health.responseTime",
        "health.errorRate",
      ],
    }

    this.addTemplate(alertTemplate)
  }
}

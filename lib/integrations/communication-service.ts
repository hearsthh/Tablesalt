import { emailService, type EmailMessage } from "./email-service"
import { smsService, type SMSMessage } from "./sms-service"

export interface CommunicationMessage {
  channel: "email" | "sms" | "whatsapp" | "push"
  recipient: string
  content: {
    subject?: string
    message: string
    html?: string
    templateId?: string
    templateData?: Record<string, any>
  }
  metadata?: Record<string, any>
}

export interface CommunicationResult {
  success: boolean
  channel: string
  messageId?: string
  error?: string
}

export class CommunicationService {
  async sendMessage(message: CommunicationMessage): Promise<CommunicationResult> {
    switch (message.channel) {
      case "email":
        return this.sendEmail(message)
      case "sms":
        return this.sendSMS(message)
      case "whatsapp":
        return this.sendWhatsApp(message)
      case "push":
        return this.sendPushNotification(message)
      default:
        return { success: false, channel: message.channel, error: "Unsupported channel" }
    }
  }

  private async sendEmail(message: CommunicationMessage): Promise<CommunicationResult> {
    const emailMessage: EmailMessage = {
      to: message.recipient,
      from: process.env.DEFAULT_FROM_EMAIL || "noreply@tablesalt.ai",
      subject: message.content.subject || "",
      html: message.content.html || message.content.message,
      text: message.content.message,
      templateId: message.content.templateId,
      templateData: message.content.templateData,
    }

    const result = await emailService.sendEmail(emailMessage)
    return {
      success: result.success,
      channel: "email",
      messageId: result.messageId,
      error: result.error,
    }
  }

  private async sendSMS(message: CommunicationMessage): Promise<CommunicationResult> {
    const smsMessage: SMSMessage = {
      to: message.recipient,
      message: message.content.message,
    }

    const result = await smsService.sendSMS(smsMessage)
    return {
      success: result.success,
      channel: "sms",
      messageId: result.messageId,
      error: result.error,
    }
  }

  private async sendWhatsApp(message: CommunicationMessage): Promise<CommunicationResult> {
    // This would integrate with WhatsApp Business API when available
    return {
      success: false,
      channel: "whatsapp",
      error: "WhatsApp integration not yet implemented",
    }
  }

  private async sendPushNotification(message: CommunicationMessage): Promise<CommunicationResult> {
    // This would integrate with Firebase FCM or similar when available
    return {
      success: false,
      channel: "push",
      error: "Push notification integration not yet implemented",
    }
  }

  async sendMultiChannelMessage(messages: CommunicationMessage[]): Promise<CommunicationResult[]> {
    const results: CommunicationResult[] = []

    for (const message of messages) {
      const result = await this.sendMessage(message)
      results.push(result)
    }

    return results
  }

  async sendCampaign(
    recipients: string[],
    content: {
      email?: { subject: string; html: string; text?: string }
      sms?: { message: string }
      whatsapp?: { message: string }
    },
  ): Promise<{ channel: string; results: CommunicationResult[] }[]> {
    const campaignResults: { channel: string; results: CommunicationResult[] }[] = []

    // Send email campaign
    if (content.email) {
      const emailResults: CommunicationResult[] = []
      for (const recipient of recipients) {
        const result = await this.sendEmail({
          channel: "email",
          recipient,
          content: {
            subject: content.email.subject,
            message: content.email.text || content.email.html,
            html: content.email.html,
          },
        })
        emailResults.push(result)
      }
      campaignResults.push({ channel: "email", results: emailResults })
    }

    // Send SMS campaign
    if (content.sms) {
      const smsResults: CommunicationResult[] = []
      for (const recipient of recipients) {
        const result = await this.sendSMS({
          channel: "sms",
          recipient,
          content: { message: content.sms.message },
        })
        smsResults.push(result)
      }
      campaignResults.push({ channel: "sms", results: smsResults })
    }

    return campaignResults
  }
}

export const communicationService = new CommunicationService()

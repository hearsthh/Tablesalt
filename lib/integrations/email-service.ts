export interface EmailProvider {
  name: string
  apiKey: string
  baseUrl: string
  send: (email: EmailMessage) => Promise<EmailResult>
}

export interface EmailMessage {
  to: string | string[]
  from: string
  subject: string
  html: string
  text?: string
  attachments?: EmailAttachment[]
  templateId?: string
  templateData?: Record<string, any>
}

export interface EmailAttachment {
  filename: string
  content: string
  contentType: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

class SendGridProvider implements EmailProvider {
  name = "SendGrid"
  apiKey: string
  baseUrl = "https://api.sendgrid.com/v3"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async send(email: EmailMessage): Promise<EmailResult> {
    try {
      const response = await fetch(`${this.baseUrl}/mail/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: Array.isArray(email.to) ? email.to.map((e) => ({ email: e })) : [{ email: email.to }],
              dynamic_template_data: email.templateData,
            },
          ],
          from: { email: email.from },
          subject: email.subject,
          content: [
            { type: "text/html", value: email.html },
            ...(email.text ? [{ type: "text/plain", value: email.text }] : []),
          ],
          template_id: email.templateId,
        }),
      })

      if (response.ok) {
        return { success: true, messageId: response.headers.get("x-message-id") || undefined }
      } else {
        const error = await response.text()
        return { success: false, error }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}

class MailgunProvider implements EmailProvider {
  name = "Mailgun"
  apiKey: string
  baseUrl: string
  domain: string

  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey
    this.domain = domain
    this.baseUrl = `https://api.mailgun.net/v3/${domain}`
  }

  async send(email: EmailMessage): Promise<EmailResult> {
    try {
      const formData = new FormData()
      formData.append("from", email.from)
      formData.append("to", Array.isArray(email.to) ? email.to.join(",") : email.to)
      formData.append("subject", email.subject)
      formData.append("html", email.html)
      if (email.text) formData.append("text", email.text)

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${this.apiKey}`)}`,
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        return { success: true, messageId: result.id }
      } else {
        const error = await response.text()
        return { success: false, error }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}

export class EmailService {
  private providers: EmailProvider[] = []
  private primaryProvider?: EmailProvider

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    if (process.env.SENDGRID_API_KEY) {
      const sendgrid = new SendGridProvider(process.env.SENDGRID_API_KEY)
      this.providers.push(sendgrid)
      if (!this.primaryProvider) this.primaryProvider = sendgrid
    }

    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      const mailgun = new MailgunProvider(process.env.MAILGUN_API_KEY, process.env.MAILGUN_DOMAIN)
      this.providers.push(mailgun)
      if (!this.primaryProvider) this.primaryProvider = mailgun
    }
  }

  async sendEmail(email: EmailMessage): Promise<EmailResult> {
    if (!this.primaryProvider) {
      return { success: false, error: "No email provider configured" }
    }

    // Try primary provider first
    const result = await this.primaryProvider.send(email)

    // If primary fails, try fallback providers
    if (!result.success && this.providers.length > 1) {
      for (const provider of this.providers) {
        if (provider !== this.primaryProvider) {
          const fallbackResult = await provider.send(email)
          if (fallbackResult.success) {
            return fallbackResult
          }
        }
      }
    }

    return result
  }

  async sendTransactionalEmail(
    to: string | string[],
    templateId: string,
    templateData: Record<string, any>,
    from?: string,
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      from: from || process.env.DEFAULT_FROM_EMAIL || "noreply@tablesalt.ai",
      subject: "", // Will be set by template
      html: "", // Will be set by template
      templateId,
      templateData,
    })
  }

  async sendMarketingEmail(to: string | string[], subject: string, html: string, text?: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      from: process.env.MARKETING_FROM_EMAIL || "marketing@tablesalt.ai",
      subject,
      html,
      text,
    })
  }
}

export const emailService = new EmailService()

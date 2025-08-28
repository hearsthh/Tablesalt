export interface SMSProvider {
  name: string
  send: (message: SMSMessage) => Promise<SMSResult>
}

export interface SMSMessage {
  to: string
  message: string
  from?: string
}

export interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
}

class TwilioProvider implements SMSProvider {
  name = "Twilio"
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid
    this.authToken = authToken
    this.fromNumber = fromNumber
  }

  async send(message: SMSMessage): Promise<SMSResult> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: message.to,
          From: message.from || this.fromNumber,
          Body: message.message,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        return { success: true, messageId: result.sid }
      } else {
        const error = await response.json()
        return { success: false, error: error.message }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}

export class SMSService {
  private providers: SMSProvider[] = []
  private primaryProvider?: SMSProvider

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilio = new TwilioProvider(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
        process.env.TWILIO_PHONE_NUMBER,
      )
      this.providers.push(twilio)
      if (!this.primaryProvider) this.primaryProvider = twilio
    }
  }

  async sendSMS(message: SMSMessage): Promise<SMSResult> {
    if (!this.primaryProvider) {
      return { success: false, error: "No SMS provider configured" }
    }

    return this.primaryProvider.send(message)
  }

  async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResult[]> {
    const results: SMSResult[] = []

    for (const message of messages) {
      const result = await this.sendSMS(message)
      results.push(result)

      // Add delay between messages to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return results
  }
}

export const smsService = new SMSService()

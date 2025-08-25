import { jobScheduler } from "../jobs/job-scheduler"
import { emailAutomation } from "./email-automation"
import { webhookHandler } from "./webhook-handlers"

class AutomationManager {
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log("[v0] Initializing automation systems...")

    // Start job scheduler
    jobScheduler.start()

    // Set up automation triggers
    this.setupAutomationTriggers()

    this.isInitialized = true
    console.log("[v0] Automation systems initialized successfully")
  }

  private setupAutomationTriggers() {
    // Customer registration trigger
    this.onCustomerRegistered = this.onCustomerRegistered.bind(this)

    // Order completion trigger
    this.onOrderCompleted = this.onOrderCompleted.bind(this)

    // Menu update trigger
    this.onMenuUpdated = this.onMenuUpdated.bind(this)

    // Payment trigger
    this.onPaymentReceived = this.onPaymentReceived.bind(this)
  }

  // Event handlers
  async onCustomerRegistered(customerData: { email: string; name: string; restaurantName: string }): Promise<void> {
    console.log("[v0] Customer registered, triggering welcome automation")

    try {
      // Send welcome email
      await emailAutomation.triggerWelcomeEmail(customerData.email, customerData.name, customerData.restaurantName)

      // Add to loyalty program (mock)
      console.log("[v0] Customer added to loyalty program")

      // Schedule follow-up engagement
      setTimeout(
        () => {
          this.scheduleFollowUpEngagement(customerData.email)
        },
        7 * 24 * 60 * 60 * 1000,
      ) // 7 days later
    } catch (error) {
      console.error("[v0] Customer registration automation failed:", error)
    }
  }

  async onOrderCompleted(orderData: {
    customerEmail: string
    customerName: string
    orderNumber: string
    orderItems: string
    orderTotal: string
    estimatedTime: string
    restaurantName: string
  }): Promise<void> {
    console.log("[v0] Order completed, triggering automation")

    try {
      // Send order confirmation
      await emailAutomation.triggerOrderConfirmation(orderData.customerEmail, orderData)

      // Schedule review request (24 hours later)
      setTimeout(
        () => {
          this.scheduleReviewRequest(orderData.customerEmail, orderData.customerName, orderData.restaurantName)
        },
        24 * 60 * 60 * 1000,
      )

      // Update customer loyalty points (mock)
      console.log("[v0] Customer loyalty points updated")

      // Send webhook to delivery platforms
      await webhookHandler.sendWebhook("uber-eats", "order.updated", {
        orderId: orderData.orderNumber,
        status: "completed",
      })
    } catch (error) {
      console.error("[v0] Order completion automation failed:", error)
    }
  }

  async onMenuUpdated(menuData: { restaurantId: string; changes: any[] }): Promise<void> {
    console.log("[v0] Menu updated, triggering sync automation")

    try {
      // Sync to delivery platforms
      await webhookHandler.sendWebhook("uber-eats", "menu.sync", menuData)
      await webhookHandler.sendWebhook("doordash", "menu.update", menuData)

      // Update search indexes (mock)
      console.log("[v0] Search indexes updated")

      // Notify staff of menu changes (mock)
      console.log("[v0] Staff notified of menu changes")
    } catch (error) {
      console.error("[v0] Menu update automation failed:", error)
    }
  }

  async onPaymentReceived(paymentData: { customerId: string; amount: number; orderId: string }): Promise<void> {
    console.log("[v0] Payment received, triggering automation")

    try {
      // Update order status
      console.log("[v0] Order status updated to paid")

      // Check for loyalty rewards
      await this.checkLoyaltyRewards(paymentData.customerId, paymentData.amount)

      // Update analytics
      console.log("[v0] Payment analytics updated")
    } catch (error) {
      console.error("[v0] Payment automation failed:", error)
    }
  }

  // Helper methods
  private async scheduleFollowUpEngagement(customerEmail: string): Promise<void> {
    console.log("[v0] Scheduling follow-up engagement for:", customerEmail)
    // Mock follow-up engagement
  }

  private async scheduleReviewRequest(
    customerEmail: string,
    customerName: string,
    restaurantName: string,
  ): Promise<void> {
    const reviewLink = `https://reviews.example.com/restaurant/${restaurantName.toLowerCase().replace(/\s+/g, "-")}`

    try {
      await emailAutomation.triggerReviewRequest(customerEmail, customerName, restaurantName, reviewLink)
      console.log("[v0] Review request sent to:", customerEmail)
    } catch (error) {
      console.error("[v0] Review request failed:", error)
    }
  }

  private async checkLoyaltyRewards(customerId: string, orderAmount: number): Promise<void> {
    // Mock loyalty calculation
    const loyaltyPoints = Math.floor(orderAmount * 10) // 10 points per dollar
    console.log(`[v0] Customer ${customerId} earned ${loyaltyPoints} loyalty points`)

    // Check if customer qualifies for reward
    if (loyaltyPoints >= 500) {
      // Mock reward trigger
      console.log("[v0] Customer qualifies for loyalty reward")
      // Would trigger loyalty reward email here
    }
  }

  // Management methods
  async runManualJob(jobId: string): Promise<void> {
    try {
      await jobScheduler.runJob(jobId)
      console.log(`[v0] Manual job completed: ${jobId}`)
    } catch (error) {
      console.error(`[v0] Manual job failed: ${jobId}`, error)
    }
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      jobScheduler: {
        running: true, // jobScheduler.isRunning would be available in real implementation
        jobs: jobScheduler.getJobs().length,
        recentResults: jobScheduler.getJobResults(10),
      },
      emailAutomation: {
        templates: emailAutomation.getTemplates().length,
        campaigns: emailAutomation.getCampaigns().length,
      },
      webhooks: {
        registered: webhookHandler.getWebhooks().length,
        recentEvents: webhookHandler.getEvents(10).length,
      },
    }
  }

  shutdown(): void {
    if (!this.isInitialized) return

    console.log("[v0] Shutting down automation systems...")
    jobScheduler.stop()
    this.isInitialized = false
    console.log("[v0] Automation systems shut down")
  }
}

export const automationManager = new AutomationManager()

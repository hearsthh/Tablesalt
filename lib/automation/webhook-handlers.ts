interface WebhookEvent {
  id: string
  source: string
  type: string
  data: any
  timestamp: string
  processed: boolean
}

interface IntegrationWebhook {
  id: string
  name: string
  url: string
  events: string[]
  secret?: string
  enabled: boolean
  lastTriggered?: string
}

class WebhookHandler {
  private webhooks: Map<string, IntegrationWebhook> = new Map()
  private events: WebhookEvent[] = []

  constructor() {
    this.setupDefaultWebhooks()
  }

  private setupDefaultWebhooks() {
    // Uber Eats webhook
    this.addWebhook({
      id: "uber-eats",
      name: "Uber Eats Integration",
      url: "https://api.ubereats.com/webhook",
      events: ["order.created", "order.updated", "menu.sync"],
      enabled: true,
    })

    // DoorDash webhook
    this.addWebhook({
      id: "doordash",
      name: "DoorDash Integration",
      url: "https://api.doordash.com/webhook",
      events: ["order.created", "order.cancelled", "menu.update"],
      enabled: true,
    })

    // Payment processor webhook
    this.addWebhook({
      id: "stripe",
      name: "Stripe Payments",
      url: "https://api.stripe.com/webhook",
      events: ["payment.succeeded", "payment.failed", "subscription.updated"],
      enabled: true,
    })

    // POS system webhook
    this.addWebhook({
      id: "pos-system",
      name: "POS System Integration",
      url: "https://api.possystem.com/webhook",
      events: ["inventory.updated", "sale.completed", "shift.ended"],
      enabled: true,
    })
  }

  addWebhook(webhook: IntegrationWebhook) {
    this.webhooks.set(webhook.id, webhook)
  }

  async processIncomingWebhook(source: string, type: string, data: any): Promise<void> {
    const event: WebhookEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source,
      type,
      data,
      timestamp: new Date().toISOString(),
      processed: false,
    }

    this.events.push(event)
    console.log(`[v0] Received webhook: ${source}.${type}`)

    try {
      await this.handleWebhookEvent(event)
      event.processed = true
      console.log(`[v0] Webhook processed successfully: ${event.id}`)
    } catch (error) {
      console.error(`[v0] Webhook processing failed: ${event.id}`, error)
    }
  }

  private async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    const { source, type, data } = event

    switch (source) {
      case "uber-eats":
        await this.handleUberEatsWebhook(type, data)
        break
      case "doordash":
        await this.handleDoorDashWebhook(type, data)
        break
      case "stripe":
        await this.handleStripeWebhook(type, data)
        break
      case "pos-system":
        await this.handlePOSWebhook(type, data)
        break
      default:
        console.log(`[v0] Unknown webhook source: ${source}`)
    }
  }

  private async handleUberEatsWebhook(type: string, data: any): Promise<void> {
    switch (type) {
      case "order.created":
        console.log("[v0] New Uber Eats order received:", data.orderId)
        // Process new order
        await this.processNewOrder(data, "uber-eats")
        break

      case "order.updated":
        console.log("[v0] Uber Eats order updated:", data.orderId)
        // Update order status
        await this.updateOrderStatus(data.orderId, data.status)
        break

      case "menu.sync":
        console.log("[v0] Uber Eats menu sync requested")
        // Sync menu items
        await this.syncMenuToUberEats()
        break
    }
  }

  private async handleDoorDashWebhook(type: string, data: any): Promise<void> {
    switch (type) {
      case "order.created":
        console.log("[v0] New DoorDash order received:", data.orderId)
        await this.processNewOrder(data, "doordash")
        break

      case "order.cancelled":
        console.log("[v0] DoorDash order cancelled:", data.orderId)
        await this.cancelOrder(data.orderId)
        break

      case "menu.update":
        console.log("[v0] DoorDash menu update requested")
        await this.syncMenuToDoorDash()
        break
    }
  }

  private async handleStripeWebhook(type: string, data: any): Promise<void> {
    switch (type) {
      case "payment.succeeded":
        console.log("[v0] Payment succeeded:", data.paymentId)
        await this.confirmPayment(data.paymentId)
        break

      case "payment.failed":
        console.log("[v0] Payment failed:", data.paymentId)
        await this.handleFailedPayment(data.paymentId)
        break

      case "subscription.updated":
        console.log("[v0] Subscription updated:", data.subscriptionId)
        await this.updateSubscription(data.subscriptionId, data.status)
        break
    }
  }

  private async handlePOSWebhook(type: string, data: any): Promise<void> {
    switch (type) {
      case "inventory.updated":
        console.log("[v0] Inventory updated:", data.items)
        await this.updateInventory(data.items)
        break

      case "sale.completed":
        console.log("[v0] Sale completed:", data.saleId)
        await this.recordSale(data)
        break

      case "shift.ended":
        console.log("[v0] Shift ended:", data.shiftId)
        await this.processShiftEnd(data)
        break
    }
  }

  // Helper methods for webhook processing
  private async processNewOrder(orderData: any, source: string): Promise<void> {
    // Mock order processing
    console.log(`[v0] Processing new order from ${source}:`, orderData)

    // In production, this would:
    // 1. Create order in database
    // 2. Send confirmation email
    // 3. Notify kitchen
    // 4. Update inventory
    // 5. Calculate analytics

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  private async updateOrderStatus(orderId: string, status: string): Promise<void> {
    console.log(`[v0] Updating order ${orderId} status to: ${status}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  private async syncMenuToUberEats(): Promise<void> {
    console.log("[v0] Syncing menu to Uber Eats...")
    // Mock menu sync
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("[v0] Menu synced to Uber Eats successfully")
  }

  private async syncMenuToDoorDash(): Promise<void> {
    console.log("[v0] Syncing menu to DoorDash...")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("[v0] Menu synced to DoorDash successfully")
  }

  private async cancelOrder(orderId: string): Promise<void> {
    console.log(`[v0] Cancelling order: ${orderId}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  private async confirmPayment(paymentId: string): Promise<void> {
    console.log(`[v0] Confirming payment: ${paymentId}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  private async handleFailedPayment(paymentId: string): Promise<void> {
    console.log(`[v0] Handling failed payment: ${paymentId}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  private async updateSubscription(subscriptionId: string, status: string): Promise<void> {
    console.log(`[v0] Updating subscription ${subscriptionId} to: ${status}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  private async updateInventory(items: any[]): Promise<void> {
    console.log("[v0] Updating inventory:", items)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  private async recordSale(saleData: any): Promise<void> {
    console.log("[v0] Recording sale:", saleData)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  private async processShiftEnd(shiftData: any): Promise<void> {
    console.log("[v0] Processing shift end:", shiftData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  // Outgoing webhook methods
  async sendWebhook(webhookId: string, eventType: string, data: any): Promise<boolean> {
    const webhook = this.webhooks.get(webhookId)
    if (!webhook || !webhook.enabled) {
      return false
    }

    if (!webhook.events.includes(eventType)) {
      return false
    }

    console.log(`[v0] Sending webhook to ${webhook.name}: ${eventType}`)

    try {
      // Mock webhook sending
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In production, this would make an actual HTTP request
      // const response = await fetch(webhook.url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Webhook-Signature': generateSignature(data, webhook.secret)
      //   },
      //   body: JSON.stringify({
      //     event: eventType,
      //     data,
      //     timestamp: new Date().toISOString()
      //   })
      // })

      webhook.lastTriggered = new Date().toISOString()
      console.log(`[v0] Webhook sent successfully to ${webhook.name}`)
      return true
    } catch (error) {
      console.error(`[v0] Webhook failed to ${webhook.name}:`, error)
      return false
    }
  }

  getWebhooks(): IntegrationWebhook[] {
    return Array.from(this.webhooks.values())
  }

  getEvents(limit = 100): WebhookEvent[] {
    return this.events.slice(-limit).reverse()
  }
}

export const webhookHandler = new WebhookHandler()

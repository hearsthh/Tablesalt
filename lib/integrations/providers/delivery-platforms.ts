import { BaseIntegrationProvider } from "./base"

interface DeliveryOrder {
  id: string
  restaurantId: string
  platform: string
  status: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  customer: {
    name: string
    phone: string
    address: string
  }
  total: number
  createdAt: Date
}

interface DeliveryAnalytics {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  topItems: Array<{
    name: string
    quantity: number
  }>
}

export class DoorDashProvider extends BaseIntegrationProvider {
  name = "DoorDash"
  type = "delivery"
  authType = "api_key" as const

  async authenticate(credentials: { apiKey: string; storeId: string }): Promise<boolean> {
    try {
      const response = await fetch(`https://openapi.doordash.com/developer/v1/stores/${credentials.storeId}`, {
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("DoorDash auth error:", error)
      return false
    }
  }

  async fetchOrders(storeId: string, apiKey: string): Promise<DeliveryOrder[]> {
    try {
      const response = await fetch(`https://openapi.doordash.com/developer/v1/stores/${storeId}/orders`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`DoorDash API error: ${response.status}`)
      }

      const data = await response.json()
      return data.orders.map((order: any) => ({
        id: order.id,
        restaurantId: storeId,
        platform: "doordash",
        status: order.status,
        items: order.items,
        customer: order.customer,
        total: order.total_amount,
        createdAt: new Date(order.created_at),
      }))
    } catch (error) {
      console.error("DoorDash fetch orders error:", error)
      return []
    }
  }

  async getAnalytics(storeId: string, apiKey: string): Promise<DeliveryAnalytics> {
    const orders = await this.fetchOrders(storeId, apiKey)

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
      topItems: this.calculateTopItems(orders),
    }
  }

  private calculateTopItems(orders: DeliveryOrder[]): Array<{ name: string; quantity: number }> {
    const itemCounts: Record<string, number> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity
      })
    })

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }))
  }
}

export class UberEatsProvider extends BaseIntegrationProvider {
  name = "Uber Eats"
  type = "delivery"
  authType = "api_key" as const

  async authenticate(credentials: { apiKey: string; storeId: string }): Promise<boolean> {
    try {
      const response = await fetch(`https://api.uber.com/v1/eats/stores/${credentials.storeId}`, {
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Uber Eats auth error:", error)
      return false
    }
  }

  async fetchOrders(storeId: string, apiKey: string): Promise<DeliveryOrder[]> {
    try {
      const response = await fetch(`https://api.uber.com/v1/eats/stores/${storeId}/orders`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Uber Eats API error: ${response.status}`)
      }

      const data = await response.json()
      return data.orders.map((order: any) => ({
        id: order.id,
        restaurantId: storeId,
        platform: "ubereats",
        status: order.status,
        items: order.cart.items,
        customer: order.eater,
        total: order.payment.total,
        createdAt: new Date(order.placed_at),
      }))
    } catch (error) {
      console.error("Uber Eats fetch orders error:", error)
      return []
    }
  }

  async getAnalytics(storeId: string, apiKey: string): Promise<DeliveryAnalytics> {
    const orders = await this.fetchOrders(storeId, apiKey)

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
      topItems: this.calculateTopItems(orders),
    }
  }

  private calculateTopItems(orders: DeliveryOrder[]): Array<{ name: string; quantity: number }> {
    const itemCounts: Record<string, number> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity
      })
    })

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }))
  }
}

export class GrubhubProvider extends BaseIntegrationProvider {
  name = "Grubhub"
  type = "delivery"
  authType = "api_key" as const

  async authenticate(credentials: { apiKey: string; restaurantId: string }): Promise<boolean> {
    try {
      const response = await fetch(`https://api-gtm.grubhub.com/restaurants/${credentials.restaurantId}`, {
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Grubhub auth error:", error)
      return false
    }
  }

  async fetchOrders(restaurantId: string, apiKey: string): Promise<DeliveryOrder[]> {
    try {
      const response = await fetch(`https://api-gtm.grubhub.com/restaurants/${restaurantId}/orders`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Grubhub API error: ${response.status}`)
      }

      const data = await response.json()
      return data.orders.map((order: any) => ({
        id: order.order_id,
        restaurantId,
        platform: "grubhub",
        status: order.state,
        items: order.lines,
        customer: order.diner,
        total: order.total,
        createdAt: new Date(order.placed_time),
      }))
    } catch (error) {
      console.error("Grubhub fetch orders error:", error)
      return []
    }
  }

  async getAnalytics(restaurantId: string, apiKey: string): Promise<DeliveryAnalytics> {
    const orders = await this.fetchOrders(restaurantId, apiKey)

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
      topItems: this.calculateTopItems(orders),
    }
  }

  private calculateTopItems(orders: DeliveryOrder[]): Array<{ name: string; quantity: number }> {
    const itemCounts: Record<string, number> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity
      })
    })

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }))
  }
}

export const deliveryProviders = {
  doordash: new DoorDashProvider(),
  ubereats: new UberEatsProvider(),
  grubhub: new GrubhubProvider(),
}

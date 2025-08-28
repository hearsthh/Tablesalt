import { BaseIntegrationProvider } from "./base"

interface POSTransaction {
  id: string
  restaurantId: string
  platform: string
  amount: number
  items: Array<{
    name: string
    quantity: number
    price: number
    category?: string
  }>
  paymentMethod: string
  timestamp: Date
  employeeId?: string
  tableNumber?: string
  orderType: "dine_in" | "takeout" | "delivery"
}

interface POSAnalytics {
  totalSales: number
  totalTransactions: number
  averageTicket: number
  topItems: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  salesByHour: Array<{
    hour: number
    sales: number
    transactions: number
  }>
  paymentMethods: Array<{
    method: string
    count: number
    amount: number
  }>
}

export class ToastProvider extends BaseIntegrationProvider {
  name = "Toast"
  type = "pos"
  authType = "oauth2" as const

  async authenticate(credentials: { clientId: string; clientSecret: string; accessToken?: string }): Promise<boolean> {
    try {
      const response = await fetch("https://ws-api.toasttab.com/restaurants/v1/restaurants", {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          "Toast-Restaurant-External-ID": "test", // This would be dynamic
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Toast auth error:", error)
      return false
    }
  }

  async fetchTransactions(
    restaurantId: string,
    accessToken: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<POSTransaction[]> {
    try {
      const params = new URLSearchParams({
        startDate: startDate?.toISOString() || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate?.toISOString() || new Date().toISOString(),
      })

      const response = await fetch(`https://ws-api.toasttab.com/orders/v2/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Toast-Restaurant-External-ID": restaurantId,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Toast API error: ${response.status}`)
      }

      const data = await response.json()
      return data.map((order: any) => ({
        id: order.guid,
        restaurantId,
        platform: "toast",
        amount: order.totalAmount,
        items:
          order.selections?.map((item: any) => ({
            name: item.item?.name || "Unknown Item",
            quantity: item.quantity,
            price: item.price,
            category: item.item?.category?.name,
          })) || [],
        paymentMethod: order.payments?.[0]?.type || "unknown",
        timestamp: new Date(order.openedDate),
        employeeId: order.server?.guid,
        tableNumber: order.table?.name,
        orderType: this.mapToastOrderType(order.source),
      }))
    } catch (error) {
      console.error("Toast fetch transactions error:", error)
      return []
    }
  }

  private mapToastOrderType(source: string): POSTransaction["orderType"] {
    const typeMap: Record<string, POSTransaction["orderType"]> = {
      ONLINE_ORDERING: "takeout",
      DELIVERY: "delivery",
      DINE_IN: "dine_in",
    }
    return typeMap[source] || "dine_in"
  }

  async getAnalytics(restaurantId: string, accessToken: string): Promise<POSAnalytics> {
    const transactions = await this.fetchTransactions(restaurantId, accessToken)

    return {
      totalSales: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: transactions.length,
      averageTicket:
        transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
      topItems: this.calculateTopItems(transactions),
      salesByHour: this.calculateSalesByHour(transactions),
      paymentMethods: this.calculatePaymentMethods(transactions),
    }
  }

  private calculateTopItems(
    transactions: POSTransaction[],
  ): Array<{ name: string; quantity: number; revenue: number }> {
    const itemStats: Record<string, { quantity: number; revenue: number }> = {}

    transactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { quantity: 0, revenue: 0 }
        }
        itemStats[item.name].quantity += item.quantity
        itemStats[item.name].revenue += item.price * item.quantity
      })
    })

    return Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  private calculateSalesByHour(
    transactions: POSTransaction[],
  ): Array<{ hour: number; sales: number; transactions: number }> {
    const hourStats: Record<number, { sales: number; transactions: number }> = {}

    transactions.forEach((transaction) => {
      const hour = transaction.timestamp.getHours()
      if (!hourStats[hour]) {
        hourStats[hour] = { sales: 0, transactions: 0 }
      }
      hourStats[hour].sales += transaction.amount
      hourStats[hour].transactions += 1
    })

    return Object.entries(hourStats)
      .map(([hour, stats]) => ({ hour: Number.parseInt(hour), ...stats }))
      .sort((a, b) => a.hour - b.hour)
  }

  private calculatePaymentMethods(
    transactions: POSTransaction[],
  ): Array<{ method: string; count: number; amount: number }> {
    const methodStats: Record<string, { count: number; amount: number }> = {}

    transactions.forEach((transaction) => {
      const method = transaction.paymentMethod
      if (!methodStats[method]) {
        methodStats[method] = { count: 0, amount: 0 }
      }
      methodStats[method].count += 1
      methodStats[method].amount += transaction.amount
    })

    return Object.entries(methodStats)
      .map(([method, stats]) => ({ method, ...stats }))
      .sort((a, b) => b.amount - a.amount)
  }
}

export class CloverProvider extends BaseIntegrationProvider {
  name = "Clover"
  type = "pos"
  authType = "api_key" as const

  async authenticate(credentials: { apiKey: string; merchantId: string }): Promise<boolean> {
    try {
      const response = await fetch(`https://api.clover.com/v3/merchants/${credentials.merchantId}`, {
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Clover auth error:", error)
      return false
    }
  }

  async fetchTransactions(
    merchantId: string,
    apiKey: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<POSTransaction[]> {
    try {
      const params = new URLSearchParams({
        filter: `createdTime>=${startDate?.getTime() || Date.now() - 24 * 60 * 60 * 1000}`,
        expand: "lineItems",
      })

      const response = await fetch(`https://api.clover.com/v3/merchants/${merchantId}/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Clover API error: ${response.status}`)
      }

      const data = await response.json()
      return (
        data.elements?.map((order: any) => ({
          id: order.id,
          restaurantId: merchantId,
          platform: "clover",
          amount: order.total,
          items:
            order.lineItems?.elements?.map((item: any) => ({
              name: item.name,
              quantity: 1, // Clover doesn't always provide quantity
              price: item.price,
              category: item.alternateName,
            })) || [],
          paymentMethod: order.payments?.elements?.[0]?.cardTransaction?.type || "unknown",
          timestamp: new Date(order.createdTime),
          employeeId: order.employee?.id,
          orderType: "dine_in" as const, // Default for Clover
        })) || []
      )
    } catch (error) {
      console.error("Clover fetch transactions error:", error)
      return []
    }
  }

  async getAnalytics(merchantId: string, apiKey: string): Promise<POSAnalytics> {
    const transactions = await this.fetchTransactions(merchantId, apiKey)

    return {
      totalSales: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: transactions.length,
      averageTicket:
        transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
      topItems: this.calculateTopItems(transactions),
      salesByHour: this.calculateSalesByHour(transactions),
      paymentMethods: this.calculatePaymentMethods(transactions),
    }
  }

  private calculateTopItems(
    transactions: POSTransaction[],
  ): Array<{ name: string; quantity: number; revenue: number }> {
    const itemStats: Record<string, { quantity: number; revenue: number }> = {}

    transactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { quantity: 0, revenue: 0 }
        }
        itemStats[item.name].quantity += item.quantity
        itemStats[item.name].revenue += item.price * item.quantity
      })
    })

    return Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  private calculateSalesByHour(
    transactions: POSTransaction[],
  ): Array<{ hour: number; sales: number; transactions: number }> {
    const hourStats: Record<number, { sales: number; transactions: number }> = {}

    transactions.forEach((transaction) => {
      const hour = transaction.timestamp.getHours()
      if (!hourStats[hour]) {
        hourStats[hour] = { sales: 0, transactions: 0 }
      }
      hourStats[hour].sales += transaction.amount
      hourStats[hour].transactions += 1
    })

    return Object.entries(hourStats)
      .map(([hour, stats]) => ({ hour: Number.parseInt(hour), ...stats }))
      .sort((a, b) => a.hour - b.hour)
  }

  private calculatePaymentMethods(
    transactions: POSTransaction[],
  ): Array<{ method: string; count: number; amount: number }> {
    const methodStats: Record<string, { count: number; amount: number }> = {}

    transactions.forEach((transaction) => {
      const method = transaction.paymentMethod
      if (!methodStats[method]) {
        methodStats[method] = { count: 0, amount: 0 }
      }
      methodStats[method].count += 1
      methodStats[method].amount += transaction.amount
    })

    return Object.entries(methodStats)
      .map(([method, stats]) => ({ method, ...stats }))
      .sort((a, b) => b.amount - a.amount)
  }
}

export const posProviders = {
  toast: new ToastProvider(),
  clover: new CloverProvider(),
}

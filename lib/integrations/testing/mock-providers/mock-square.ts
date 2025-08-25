import { BaseTestProvider } from "../base-test-provider"
import type { IntegrationConfig, DataType } from "../../types"

export class MockSquareProvider extends BaseTestProvider {
  constructor(config: IntegrationConfig) {
    super({
      ...config,
      name: "Mock Square",
      type: "pos",
      authType: "oauth2",
      baseUrl: "https://mock-connect.squareup.com",
      regions: ["US", "CA", "AU"],
      dataTypes: ["orders", "menu", "customers", "payments"],
      rateLimits: { requestsPerMinute: 1000, requestsPerHour: 10000 },
    })
  }

  protected initializeMockData(): void {
    this.mockData.set("orders", [
      {
        id: "order_mock_1",
        state: "COMPLETED",
        line_items: [
          {
            name: "Burger",
            quantity: "2",
            base_price_money: { amount: 1200, currency: "USD" },
          },
          {
            name: "Fries",
            quantity: "1",
            base_price_money: { amount: 400, currency: "USD" },
          },
        ],
        total_money: { amount: 2800, currency: "USD" },
        total_tax_money: { amount: 280, currency: "USD" },
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "order_mock_2",
        state: "COMPLETED",
        line_items: [
          {
            name: "Pizza",
            quantity: "1",
            base_price_money: { amount: 1800, currency: "USD" },
          },
        ],
        total_money: { amount: 1980, currency: "USD" },
        total_tax_money: { amount: 180, currency: "USD" },
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ])

    this.mockData.set("menu", [
      {
        type: "CATEGORY",
        id: "cat_mock_1",
        category_data: {
          name: "Main Dishes",
        },
      },
      {
        type: "ITEM",
        id: "item_mock_1",
        item_data: {
          name: "Burger",
          description: "Delicious beef burger",
          category_id: "cat_mock_1",
          variations: [
            {
              id: "var_mock_1",
              item_variation_data: {
                name: "Regular",
                pricing_type: "FIXED_PRICING",
                price_money: { amount: 1200, currency: "USD" },
              },
            },
          ],
        },
      },
    ])

    this.mockData.set("customers", [
      {
        id: "cust_mock_1",
        given_name: "John",
        family_name: "Doe",
        email_address: "john@example.com",
        phone_number: "+1234567890",
        created_at: new Date(Date.now() - 2592000000).toISOString(),
      },
    ])
  }

  protected getMockResponse(method: string, endpoint: string, data?: any): any {
    if (endpoint.includes("/orders")) {
      return { orders: this.mockData.get("orders") || [] }
    }

    if (endpoint.includes("/catalog/list")) {
      return { objects: this.mockData.get("menu") || [] }
    }

    if (endpoint.includes("/customers")) {
      return { customers: this.mockData.get("customers") || [] }
    }

    if (endpoint.includes("/merchants")) {
      return {
        merchant: [{ id: "merchant_mock_1", business_name: "Mock Restaurant", country: "US" }],
      }
    }

    return { data: [] }
  }

  async fetchData(dataType: DataType): Promise<any> {
    await this.ensureAuthenticated()

    switch (dataType) {
      case "orders":
        return this.transformOrders(this.mockData.get("orders") || [])
      case "menu":
        return this.transformMenu(this.mockData.get("menu") || [])
      case "customers":
        return this.transformCustomers(this.mockData.get("customers") || [])
      default:
        throw new Error(`Unsupported data type: ${dataType}`)
    }
  }

  private transformOrders(orders: any[]): any[] {
    return orders.map((order) => ({
      id: order.id,
      status: order.state,
      items:
        order.line_items?.map((item) => ({
          name: item.name,
          quantity: Number.parseInt(item.quantity),
          price: item.base_price_money.amount / 100,
        })) || [],
      total: order.total_money.amount / 100,
      tax: order.total_tax_money?.amount / 100 || 0,
      orderTime: new Date(order.created_at),
      source: "mock-square",
    }))
  }

  private transformMenu(menuItems: any[]): any {
    const categories = menuItems.filter((item) => item.type === "CATEGORY")
    const items = menuItems.filter((item) => item.type === "ITEM")

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.category_data.name,
        items: items
          .filter((item) => item.item_data.category_id === category.id)
          .map((item) => ({
            id: item.id,
            name: item.item_data.name,
            description: item.item_data.description,
            price: item.item_data.variations?.[0]?.item_variation_data?.price_money?.amount / 100 || 0,
          })),
      })),
      source: "mock-square",
    }
  }

  private transformCustomers(customers: any[]): any[] {
    return customers.map((customer) => ({
      id: customer.id,
      name: `${customer.given_name} ${customer.family_name}`,
      email: customer.email_address,
      phone: customer.phone_number,
      createdAt: new Date(customer.created_at),
      source: "mock-square",
    }))
  }
}

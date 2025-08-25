import { BaseIntegrationProvider } from "../base-provider"
import type { IntegrationCredentials, DataType } from "../types"

export class SquarePOSProvider extends BaseIntegrationProvider {
  id = "square_pos"
  name = "Square POS"
  category = "pos" as const
  regions = ["North America", "Europe", "Asia", "Oceania"]
  cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "San Francisco",
    "Toronto",
    "Vancouver",
    "London",
    "Paris",
    "Tokyo",
    "Sydney",
  ]
  authType = "oauth2" as const
  apiVersion = "2023-10-18"
  baseUrl = "https://connect.squareup.com/v2"
  rateLimit = { requests: 500, window: 60 } // 500 requests per minute

  private readonly scopes = [
    "MERCHANT_PROFILE_READ",
    "PAYMENTS_READ",
    "ORDERS_READ",
    "CUSTOMERS_READ",
    "ITEMS_READ",
    "INVENTORY_READ",
  ]

  async authenticate(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      if (!credentials.clientId || !credentials.clientSecret) {
        throw new Error("Square POS requires clientId and clientSecret")
      }

      // For OAuth2, we need to handle the authorization flow
      if (!credentials.accessToken) {
        // Generate authorization URL for user to visit
        const authUrl = this.generateAuthUrl(credentials.clientId)
        console.log(`[v0] Please visit this URL to authorize Square: ${authUrl}`)
        return false // User needs to complete OAuth flow
      }

      // Verify the access token by making a test request
      const response = await this.makeRequest("/merchants", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          "Square-Version": this.apiVersion,
        },
      })

      if (response.ok) {
        this.credentials = credentials
        return true
      }

      return false
    } catch (error) {
      console.error("[v0] Square POS authentication failed:", error)
      return false
    }
  }

  private generateAuthUrl(clientId: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      scope: this.scopes.join(" "),
      session: "false",
      state: crypto.randomUUID(), // CSRF protection
    })

    return `https://connect.squareup.com/oauth2/authorize?${params.toString()}`
  }

  async fetchData(dataType: DataType, options: any = {}): Promise<any> {
    if (!this.credentials?.accessToken) {
      throw new Error("Not authenticated with Square POS")
    }

    switch (dataType) {
      case "restaurant_info":
        return this.fetchMerchantInfo(options)
      case "menu":
        return this.fetchCatalog(options)
      case "orders":
        return this.fetchOrders(options)
      case "customers":
        return this.fetchCustomers(options)
      case "analytics":
        return this.fetchPayments(options)
      default:
        throw new Error(`Data type ${dataType} not supported by Square POS`)
    }
  }

  private async fetchMerchantInfo(options: any = {}) {
    try {
      const response = await this.makeRequest("/merchants")
      const data = await response.json()

      if (!data.merchant || data.merchant.length === 0) {
        throw new Error("No Square merchant found")
      }

      const merchant = data.merchant[0]

      // Get location details
      const locationsResponse = await this.makeRequest("/locations")
      const locationsData = await locationsResponse.json()

      const locations = (locationsData.locations || []).map((location: any) => ({
        id: location.id,
        name: location.name,
        address: {
          street: location.address?.address_line_1,
          city: location.address?.locality,
          state: location.address?.administrative_district_level_1,
          postalCode: location.address?.postal_code,
          country: location.address?.country,
        },
        phone: location.phone_number,
        website: location.website_url,
        timezone: location.timezone,
        currency: location.currency,
        status: location.status,
        businessHours: this.transformBusinessHours(location.business_hours),
        coordinates: location.coordinates
          ? {
              lat: location.coordinates.latitude,
              lng: location.coordinates.longitude,
            }
          : null,
        lastUpdated: new Date().toISOString(),
        source: "Square POS",
      }))

      return {
        merchantId: merchant.id,
        businessName: merchant.business_name,
        country: merchant.country,
        languageCode: merchant.language_code,
        currency: merchant.currency,
        status: merchant.status,
        locations,
        lastUpdated: new Date().toISOString(),
        source: "Square POS",
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Square merchant info:", error)
      throw error
    }
  }

  private async fetchCatalog(options: any = {}) {
    try {
      const { locationId, limit = 100 } = options
      const params = new URLSearchParams({
        types: "ITEM,CATEGORY",
        ...(limit && { limit: limit.toString() }),
      })

      const response = await this.makeRequest(`/catalog/list?${params.toString()}`)
      const data = await response.json()

      const items: any[] = []
      const categories: any[] = []

      for (const object of data.objects || []) {
        if (object.type === "ITEM" && object.item_data) {
          const item = object.item_data
          items.push({
            id: object.id,
            name: item.name,
            description: item.description,
            categoryId: item.category_id,
            variations: (item.variations || []).map((variation: any) => ({
              id: variation.id,
              name: variation.item_variation_data?.name,
              price: variation.item_variation_data?.price_money
                ? {
                    amount: variation.item_variation_data.price_money.amount,
                    currency: variation.item_variation_data.price_money.currency,
                  }
                : null,
              sku: variation.item_variation_data?.sku,
              available:
                !variation.item_variation_data?.track_inventory ||
                variation.item_variation_data?.inventory_alert_type !== "LOW_QUANTITY",
            })),
            images: (object.item_data.image_ids || []).map((imageId: string) => ({
              id: imageId,
              url: `https://items-images-production.s3.us-west-2.amazonaws.com/files/${imageId}/original.jpeg`,
            })),
            lastUpdated: object.updated_at,
            source: "Square POS",
          })
        } else if (object.type === "CATEGORY" && object.category_data) {
          categories.push({
            id: object.id,
            name: object.category_data.name,
            lastUpdated: object.updated_at,
            source: "Square POS",
          })
        }
      }

      return {
        categories,
        items,
        totalCount: data.objects?.length || 0,
        lastUpdated: new Date().toISOString(),
        source: "Square POS",
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Square catalog:", error)
      throw error
    }
  }

  private async fetchOrders(options: any = {}) {
    try {
      const { locationId, startDate, endDate, limit = 100 } = options

      const query: any = {
        filter: {
          date_time_filter: {
            created_at: {
              start_at: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              end_at: endDate || new Date().toISOString(),
            },
          },
        },
        sort: {
          sort_field: "CREATED_AT",
          sort_order: "DESC",
        },
        limit,
      }

      if (locationId) {
        query.location_ids = [locationId]
      }

      const response = await this.makeRequest("/orders/search", {
        method: "POST",
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      return (data.orders || []).map((order: any) => ({
        id: order.id,
        locationId: order.location_id,
        orderNumber: order.reference_id,
        state: order.state,
        totalAmount: order.total_money
          ? {
              amount: order.total_money.amount,
              currency: order.total_money.currency,
            }
          : null,
        totalTax: order.total_tax_money
          ? {
              amount: order.total_tax_money.amount,
              currency: order.total_tax_money.currency,
            }
          : null,
        totalDiscount: order.total_discount_money
          ? {
              amount: order.total_discount_money.amount,
              currency: order.total_discount_money.currency,
            }
          : null,
        customerId: order.customer_id,
        lineItems: (order.line_items || []).map((item: any) => ({
          id: item.uid,
          catalogObjectId: item.catalog_object_id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.base_price_money
            ? {
                amount: item.base_price_money.amount,
                currency: item.base_price_money.currency,
              }
            : null,
          totalPrice: item.total_money
            ? {
                amount: item.total_money.amount,
                currency: item.total_money.currency,
              }
            : null,
          modifiers: (item.modifiers || []).map((modifier: any) => ({
            id: modifier.uid,
            catalogObjectId: modifier.catalog_object_id,
            name: modifier.name,
            price: modifier.total_price_money
              ? {
                  amount: modifier.total_price_money.amount,
                  currency: modifier.total_price_money.currency,
                }
              : null,
          })),
        })),
        fulfillments: (order.fulfillments || []).map((fulfillment: any) => ({
          id: fulfillment.uid,
          type: fulfillment.type,
          state: fulfillment.state,
          pickupDetails: fulfillment.pickup_details,
          shipmentDetails: fulfillment.shipment_details,
        })),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        closedAt: order.closed_at,
        source: "Square POS",
      }))
    } catch (error) {
      console.error("[v0] Failed to fetch Square orders:", error)
      throw error
    }
  }

  private async fetchCustomers(options: any = {}) {
    try {
      const { limit = 100, cursor } = options
      const params = new URLSearchParams({
        ...(limit && { limit: limit.toString() }),
        ...(cursor && { cursor }),
      })

      const response = await this.makeRequest(`/customers?${params.toString()}`)
      const data = await response.json()

      return {
        customers: (data.customers || []).map((customer: any) => ({
          id: customer.id,
          givenName: customer.given_name,
          familyName: customer.family_name,
          companyName: customer.company_name,
          nickname: customer.nickname,
          emailAddress: customer.email_address,
          phoneNumber: customer.phone_number,
          address: customer.address
            ? {
                street: customer.address.address_line_1,
                city: customer.address.locality,
                state: customer.address.administrative_district_level_1,
                postalCode: customer.address.postal_code,
                country: customer.address.country,
              }
            : null,
          birthday: customer.birthday,
          referenceId: customer.reference_id,
          note: customer.note,
          preferences: customer.preferences,
          createdAt: customer.created_at,
          updatedAt: customer.updated_at,
          source: "Square POS",
        })),
        cursor: data.cursor,
        lastUpdated: new Date().toISOString(),
        source: "Square POS",
      }
    } catch (error) {
      console.error("[v0] Failed to fetch Square customers:", error)
      throw error
    }
  }

  private async fetchPayments(options: any = {}) {
    try {
      const { locationId, startDate, endDate, limit = 100 } = options

      const params = new URLSearchParams({
        begin_time: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: endDate || new Date().toISOString(),
        ...(limit && { limit: limit.toString() }),
        ...(locationId && { location_id: locationId }),
      })

      const response = await this.makeRequest(`/payments?${params.toString()}`)
      const data = await response.json()

      return (data.payments || []).map((payment: any) => ({
        id: payment.id,
        orderId: payment.order_id,
        locationId: payment.location_id,
        status: payment.status,
        amountMoney: payment.amount_money
          ? {
              amount: payment.amount_money.amount,
              currency: payment.amount_money.currency,
            }
          : null,
        tipMoney: payment.tip_money
          ? {
              amount: payment.tip_money.amount,
              currency: payment.tip_money.currency,
            }
          : null,
        totalMoney: payment.total_money
          ? {
              amount: payment.total_money.amount,
              currency: payment.total_money.currency,
            }
          : null,
        appFeeMoney: payment.app_fee_money
          ? {
              amount: payment.app_fee_money.amount,
              currency: payment.app_fee_money.currency,
            }
          : null,
        processingFee: payment.processing_fee
          ? payment.processing_fee.map((fee: any) => ({
              effectiveAt: fee.effective_at,
              type: fee.type,
              amountMoney: fee.amount_money,
            }))
          : [],
        refundedMoney: payment.refunded_money
          ? {
              amount: payment.refunded_money.amount,
              currency: payment.refunded_money.currency,
            }
          : null,
        cardDetails: payment.card_details
          ? {
              status: payment.card_details.status,
              card: payment.card_details.card,
              entryMethod: payment.card_details.entry_method,
              cvvStatus: payment.card_details.cvv_status,
              avsStatus: payment.card_details.avs_status,
            }
          : null,
        receiptNumber: payment.receipt_number,
        receiptUrl: payment.receipt_url,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        source: "Square POS",
      }))
    } catch (error) {
      console.error("[v0] Failed to fetch Square payments:", error)
      throw error
    }
  }

  private transformBusinessHours(businessHours: any) {
    if (!businessHours?.periods) return null

    const hours: Record<string, { open: string; close: string; closed?: boolean }> = {}
    const daysMap = {
      MON: "monday",
      TUE: "tuesday",
      WED: "wednesday",
      THU: "thursday",
      FRI: "friday",
      SAT: "saturday",
      SUN: "sunday",
    }

    for (const period of businessHours.periods) {
      const day = daysMap[period.day_of_week as keyof typeof daysMap]
      if (day) {
        hours[day] = {
          open: period.start_local_time || "00:00",
          close: period.end_local_time || "23:59",
          closed: !period.start_local_time && !period.end_local_time,
        }
      }
    }

    return hours
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.credentials?.accessToken) {
      return {}
    }

    return {
      Authorization: `Bearer ${this.credentials.accessToken}`,
      "Square-Version": this.apiVersion,
    }
  }

  // Handle OAuth2 callback and exchange code for tokens
  async handleOAuthCallback(code: string): Promise<IntegrationCredentials> {
    if (!this.credentials?.clientId || !this.credentials?.clientSecret) {
      throw new Error("Client credentials not set")
    }

    const tokenResponse = await fetch("https://connect.squareup.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Square-Version": this.apiVersion,
      },
      body: JSON.stringify({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens")
    }

    const tokens = await tokenResponse.json()

    return {
      ...this.credentials,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_at,
      merchantId: tokens.merchant_id,
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.credentials?.accessToken) return false

      const response = await this.makeRequest("/merchants", { method: "GET" })
      return response.ok
    } catch {
      return false
    }
  }
}

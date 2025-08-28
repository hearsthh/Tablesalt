import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { deliveryProviders } from "@/lib/integrations/providers/delivery-platforms"
import { reservationProviders } from "@/lib/integrations/providers/reservation-systems"
import { posProviders } from "@/lib/integrations/providers/pos-systems"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { provider, restaurantId, credentials } = await request.json()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let syncResult: any = {}

    try {
      switch (provider) {
        case "doordash":
          syncResult = await syncDoorDashData(supabase, restaurantId, credentials)
          break
        case "ubereats":
          syncResult = await syncUberEatsData(supabase, restaurantId, credentials)
          break
        case "grubhub":
          syncResult = await syncGrubhubData(supabase, restaurantId, credentials)
          break
        case "opentable":
          syncResult = await syncOpenTableData(supabase, restaurantId, credentials)
          break
        case "resy":
          syncResult = await syncResyData(supabase, restaurantId, credentials)
          break
        case "toast":
          syncResult = await syncToastData(supabase, restaurantId, credentials)
          break
        case "clover":
          syncResult = await syncCloverData(supabase, restaurantId, credentials)
          break
        default:
          throw new Error(`Unsupported provider: ${provider}`)
      }

      // Update last sync time
      await supabase
        .from("restaurant_integrations")
        .update({
          last_sync: new Date().toISOString(),
          sync_status: "success",
          last_error: null,
        })
        .eq("restaurant_id", restaurantId)
        .eq("provider_name", provider)

      return NextResponse.json({
        success: true,
        syncResult,
        message: `${provider} data synced successfully`,
      })
    } catch (syncError) {
      // Update sync error
      await supabase
        .from("restaurant_integrations")
        .update({
          sync_status: "error",
          last_error: syncError instanceof Error ? syncError.message : "Unknown error",
        })
        .eq("restaurant_id", restaurantId)
        .eq("provider_name", provider)

      throw syncError
    }
  } catch (error) {
    console.error("Integration sync error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

async function syncDoorDashData(supabase: any, restaurantId: string, credentials: any) {
  const provider = deliveryProviders.doordash
  const orders = await provider.fetchOrders(credentials.storeId, credentials.apiKey)

  // Store orders in database
  for (const order of orders) {
    await supabase.from("orders").upsert({
      id: `doordash_${order.id}`,
      restaurant_id: restaurantId,
      platform: "doordash",
      external_id: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      total_amount: order.total,
      status: order.status,
      order_type: "delivery",
      items: order.items,
      created_at: order.createdAt.toISOString(),
    })
  }

  return { ordersSync: orders.length }
}

async function syncUberEatsData(supabase: any, restaurantId: string, credentials: any) {
  const provider = deliveryProviders.ubereats
  const orders = await provider.fetchOrders(credentials.storeId, credentials.apiKey)

  for (const order of orders) {
    await supabase.from("orders").upsert({
      id: `ubereats_${order.id}`,
      restaurant_id: restaurantId,
      platform: "ubereats",
      external_id: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      total_amount: order.total,
      status: order.status,
      order_type: "delivery",
      items: order.items,
      created_at: order.createdAt.toISOString(),
    })
  }

  return { ordersSync: orders.length }
}

async function syncGrubhubData(supabase: any, restaurantId: string, credentials: any) {
  const provider = deliveryProviders.grubhub
  const orders = await provider.fetchOrders(credentials.restaurantId, credentials.apiKey)

  for (const order of orders) {
    await supabase.from("orders").upsert({
      id: `grubhub_${order.id}`,
      restaurant_id: restaurantId,
      platform: "grubhub",
      external_id: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      total_amount: order.total,
      status: order.status,
      order_type: "delivery",
      items: order.items,
      created_at: order.createdAt.toISOString(),
    })
  }

  return { ordersSync: orders.length }
}

async function syncOpenTableData(supabase: any, restaurantId: string, credentials: any) {
  const provider = reservationProviders.opentable
  const reservations = await provider.fetchReservations(credentials.restaurantId, credentials.apiKey)

  for (const reservation of reservations) {
    await supabase.from("reservations").upsert({
      id: `opentable_${reservation.id}`,
      restaurant_id: restaurantId,
      platform: "opentable",
      external_id: reservation.id,
      customer_name: reservation.customerName,
      customer_email: reservation.customerEmail,
      customer_phone: reservation.customerPhone,
      party_size: reservation.partySize,
      reservation_time: reservation.dateTime.toISOString(),
      status: reservation.status,
      special_requests: reservation.specialRequests,
      created_at: new Date().toISOString(),
    })
  }

  return { reservationsSync: reservations.length }
}

async function syncResyData(supabase: any, restaurantId: string, credentials: any) {
  const provider = reservationProviders.resy
  const reservations = await provider.fetchReservations(credentials.venueId, credentials.apiKey)

  for (const reservation of reservations) {
    await supabase.from("reservations").upsert({
      id: `resy_${reservation.id}`,
      restaurant_id: restaurantId,
      platform: "resy",
      external_id: reservation.id,
      customer_name: reservation.customerName,
      customer_email: reservation.customerEmail,
      customer_phone: reservation.customerPhone,
      party_size: reservation.partySize,
      reservation_time: reservation.dateTime.toISOString(),
      status: reservation.status,
      created_at: new Date().toISOString(),
    })
  }

  return { reservationsSync: reservations.length }
}

async function syncToastData(supabase: any, restaurantId: string, credentials: any) {
  const provider = posProviders.toast
  const transactions = await provider.fetchTransactions(restaurantId, credentials.accessToken)

  for (const transaction of transactions) {
    await supabase.from("orders").upsert({
      id: `toast_${transaction.id}`,
      restaurant_id: restaurantId,
      platform: "toast",
      external_id: transaction.id,
      total_amount: transaction.amount,
      payment_method: transaction.paymentMethod,
      order_type: transaction.orderType,
      items: transaction.items,
      employee_id: transaction.employeeId,
      table_number: transaction.tableNumber,
      created_at: transaction.timestamp.toISOString(),
    })
  }

  return { transactionsSync: transactions.length }
}

async function syncCloverData(supabase: any, restaurantId: string, credentials: any) {
  const provider = posProviders.clover
  const transactions = await provider.fetchTransactions(credentials.merchantId, credentials.apiKey)

  for (const transaction of transactions) {
    await supabase.from("orders").upsert({
      id: `clover_${transaction.id}`,
      restaurant_id: restaurantId,
      platform: "clover",
      external_id: transaction.id,
      total_amount: transaction.amount,
      payment_method: transaction.paymentMethod,
      order_type: transaction.orderType,
      items: transaction.items,
      employee_id: transaction.employeeId,
      created_at: transaction.timestamp.toISOString(),
    })
  }

  return { transactionsSync: transactions.length }
}

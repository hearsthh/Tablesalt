import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headers = request.headers

    // Verify PayPal webhook signature
    const isValid = await verifyPayPalWebhook(body, headers)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    switch (body.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscription = body.resource

        await supabase
          .from("user_subscriptions")
          .update({
            status: "active",
            current_period_start: new Date(),
            current_period_end: new Date(subscription.billing_info?.next_billing_time),
          })
          .eq("paypal_subscription_id", subscription.id)

        break
      }

      case "BILLING.SUBSCRIPTION.CANCELLED": {
        const subscription = body.resource

        await supabase
          .from("user_subscriptions")
          .update({ status: "canceled" })
          .eq("paypal_subscription_id", subscription.id)

        break
      }

      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const subscription = body.resource

        await supabase
          .from("user_subscriptions")
          .update({ status: "past_due" })
          .eq("paypal_subscription_id", subscription.id)

        break
      }

      case "PAYMENT.SALE.COMPLETED": {
        // Handle successful payment
        const payment = body.resource
        console.log("[v0] PayPal payment completed:", payment.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function verifyPayPalWebhook(body: any, headers: Headers): Promise<boolean> {
  // In production, implement proper PayPal webhook signature verification
  // For now, return true for development
  if (process.env.NODE_ENV === "development") {
    return true
  }

  try {
    // PayPal webhook verification would go here
    // This involves validating the webhook signature using PayPal's verification API
    return true
  } catch (error) {
    console.error("PayPal webhook verification error:", error)
    return false
  }
}

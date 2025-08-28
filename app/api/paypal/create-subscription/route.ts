import { type NextRequest, NextResponse } from "next/server"
import { paymentConfig } from "@/lib/integrations/payment-config"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    if (!paymentConfig.paypal.clientId || !paymentConfig.paypal.clientSecret) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 503 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get PayPal access token
    const authResponse = await getPayPalAccessToken()
    if (!authResponse.success) {
      return NextResponse.json({ error: "PayPal authentication failed" }, { status: 500 })
    }

    // Create PayPal subscription
    const subscriptionData = {
      plan_id: getPayPalPlanId(plan),
      subscriber: {
        email_address: user.email,
      },
      application_context: {
        brand_name: "Tablesalt AI",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: `${request.nextUrl.origin}/billing/paypal/success`,
        cancel_url: `${request.nextUrl.origin}/billing/paypal/cancel`,
      },
    }

    const baseUrl = paymentConfig.paypal.sandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com"

    const response = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authResponse.token}`,
      },
      body: JSON.stringify(subscriptionData),
    })

    const subscription = await response.json()

    if (response.ok) {
      // Store pending subscription in database
      await supabase.from("user_subscriptions").upsert({
        user_id: user.id,
        paypal_subscription_id: subscription.id,
        plan: plan,
        status: "pending",
      })

      // Return approval URL
      const approvalUrl = subscription.links.find((link: any) => link.rel === "approve")?.href
      return NextResponse.json({ approvalUrl })
    } else {
      return NextResponse.json({ error: "Failed to create PayPal subscription" }, { status: 500 })
    }
  } catch (error) {
    console.error("PayPal subscription error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

async function getPayPalAccessToken(): Promise<{ success: boolean; token?: string }> {
  try {
    const credentials = Buffer.from(`${paymentConfig.paypal.clientId}:${paymentConfig.paypal.clientSecret}`).toString(
      "base64",
    )

    const baseUrl = paymentConfig.paypal.sandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com"

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const data = await response.json()

    if (response.ok && data.access_token) {
      return { success: true, token: data.access_token }
    }

    return { success: false }
  } catch (error) {
    console.error("PayPal auth error:", error)
    return { success: false }
  }
}

function getPayPalPlanId(plan: string): string {
  // These would be your actual PayPal plan IDs
  const planIds = {
    starter: process.env.PAYPAL_STARTER_PLAN_ID || "P-starter",
    professional: process.env.PAYPAL_PROFESSIONAL_PLAN_ID || "P-professional",
    enterprise: process.env.PAYPAL_ENTERPRISE_PLAN_ID || "P-enterprise",
  }

  return planIds[plan as keyof typeof planIds] || planIds.starter
}

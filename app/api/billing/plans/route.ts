import { NextResponse } from "next/server"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe/config"
import { paymentConfig } from "@/lib/integrations/payment-config"

export async function GET() {
  try {
    const enabledProviders = paymentConfig.getEnabledProviders()

    return NextResponse.json({
      plans: SUBSCRIPTION_PLANS,
      providers: enabledProviders.map((p) => ({
        name: p.name,
        type: p.type,
        enabled: p.enabled,
      })),
      defaultProvider: paymentConfig.getDefaultProvider()?.type || null,
    })
  } catch (error) {
    console.error("Error fetching billing plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

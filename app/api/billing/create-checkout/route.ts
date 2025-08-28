import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { paymentConfig } from "@/lib/integrations/payment-config"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()
    const supabase = createSupabaseServerClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create checkout session using the payment config manager
    const result = await paymentConfig.createCheckoutSession(plan, user.id, user.email!)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Billing checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

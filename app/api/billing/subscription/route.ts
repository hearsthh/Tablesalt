import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createStripeClient } from "@/lib/stripe/config"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's subscription from database
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    // If Stripe subscription, get additional details from Stripe
    if (subscription.provider === "stripe" && subscription.external_id) {
      const stripe = createStripeClient()
      if (stripe) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(subscription.external_id)
          return NextResponse.json({
            subscription: {
              ...subscription,
              stripeDetails: {
                status: stripeSubscription.status,
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              },
            },
          })
        } catch (stripeError) {
          console.error("Error fetching Stripe subscription:", stripeError)
        }
      }
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's subscription
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error || !subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Cancel subscription with provider
    if (subscription.provider === "stripe" && subscription.external_id) {
      const stripe = createStripeClient()
      if (stripe) {
        await stripe.subscriptions.update(subscription.external_id, {
          cancel_at_period_end: true,
        })
      }
    }

    // Update subscription status in database
    await supabase
      .from("user_subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    return NextResponse.json({ success: true, message: "Subscription cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}

import Stripe from "stripe"

export function createStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is not set - Stripe functionality will be disabled")
    return null
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  })
}

export const SUBSCRIPTION_PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter",
    features: ["Basic AI insights", "Up to 100 menu items", "Email support", "1 restaurant location"],
    limits: {
      restaurants: 1,
      menuItems: 100,
      aiGenerations: 50,
      campaigns: 5,
    },
  },
  professional: {
    name: "Professional",
    price: 149,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "price_professional",
    features: [
      "Advanced AI suite",
      "Unlimited menu items",
      "Priority support",
      "Up to 3 restaurant locations",
      "Marketing automation",
      "Customer intelligence",
    ],
    limits: {
      restaurants: 3,
      menuItems: -1, // unlimited
      aiGenerations: 500,
      campaigns: 25,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 399,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
    features: [
      "Full AI platform",
      "Unlimited everything",
      "24/7 phone support",
      "Unlimited locations",
      "Custom integrations",
      "White-label options",
    ],
    limits: {
      restaurants: -1, // unlimited
      menuItems: -1,
      aiGenerations: -1,
      campaigns: -1,
    },
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS

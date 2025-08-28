export interface PaymentConfig {
  stripe: {
    secretKey: string
    publishableKey: string
    webhookSecret: string
    priceIds: {
      starter: string
      professional: string
      enterprise: string
    }
  }
  paypal: {
    clientId: string
    clientSecret: string
    webhookId: string
    sandbox: boolean
  }
}

export const paymentConfig: PaymentConfig = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    priceIds: {
      starter: process.env.STRIPE_STARTER_PRICE_ID || "price_starter",
      professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "price_professional",
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
    },
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
    webhookId: process.env.PAYPAL_WEBHOOK_ID || "",
    sandbox: process.env.NODE_ENV !== "production",
  },
}

export function validatePaymentConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  // Check Stripe config
  if (!paymentConfig.stripe.secretKey) missing.push("STRIPE_SECRET_KEY")
  if (!paymentConfig.stripe.publishableKey) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
  if (!paymentConfig.stripe.webhookSecret) missing.push("STRIPE_WEBHOOK_SECRET")

  // Check PayPal config
  if (!paymentConfig.paypal.clientId) missing.push("PAYPAL_CLIENT_ID")
  if (!paymentConfig.paypal.clientSecret) missing.push("PAYPAL_CLIENT_SECRET")

  return {
    valid: missing.length === 0,
    missing,
  }
}

export interface SocialMediaConfig {
  facebook: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
    apiVersion: string
  }
  instagram: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
  }
  twitter: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
    apiVersion: string
  }
  whatsapp: {
    accessToken: string
    phoneNumberId: string
    webhookVerifyToken: string
    apiVersion: string
  }
}

export const socialMediaConfig: SocialMediaConfig = {
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`,
    scopes: [
      "pages_manage_posts",
      "pages_read_engagement",
      "pages_show_list",
      "business_management",
      "ads_read",
      "ads_management",
    ],
    apiVersion: "v18.0",
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || process.env.FACEBOOK_CLIENT_SECRET || "",
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
    scopes: ["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement"],
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || "",
    clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    redirectUri: process.env.TWITTER_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
    scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    apiVersion: "2",
  },
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "",
    apiVersion: "v18.0",
  },
}

export function validateSocialMediaConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  // Check Facebook/Instagram config
  if (!socialMediaConfig.facebook.clientId) missing.push("FACEBOOK_CLIENT_ID")
  if (!socialMediaConfig.facebook.clientSecret) missing.push("FACEBOOK_CLIENT_SECRET")

  // Check Twitter config
  if (!socialMediaConfig.twitter.clientId) missing.push("TWITTER_CLIENT_ID")
  if (!socialMediaConfig.twitter.clientSecret) missing.push("TWITTER_CLIENT_SECRET")

  // Check WhatsApp config
  if (!socialMediaConfig.whatsapp.accessToken) missing.push("WHATSAPP_ACCESS_TOKEN")
  if (!socialMediaConfig.whatsapp.phoneNumberId) missing.push("WHATSAPP_PHONE_NUMBER_ID")

  return {
    valid: missing.length === 0,
    missing,
  }
}

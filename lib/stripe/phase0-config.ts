export const PHASE0_CONFIG = {
  trialPeriodDays: 90, // 3 months free trial for Phase 0
  maxTestRestaurants: 10,
  testPlanLimits: {
    restaurants: 1,
    menuItems: 500,
    aiGenerations: 200,
    campaigns: 10,
    integrations: 5,
  },
  features: [
    "Full AI suite access",
    "Unlimited menu optimization",
    "All integrations included",
    "Priority support",
    "Direct feedback channel",
    "Early access to new features",
  ],
}

export const PHASE0_SUBSCRIPTION_PLAN = {
  phase0_trial: {
    name: "Phase 0 Trial",
    price: 0,
    priceId: "phase0_trial",
    trialDays: PHASE0_CONFIG.trialPeriodDays,
    features: PHASE0_CONFIG.features,
    limits: PHASE0_CONFIG.testPlanLimits,
    description: "Exclusive 90-day trial for Phase 0 test restaurants",
  },
} as const

export function isPhase0Restaurant(restaurantId: string): boolean {
  // Check if restaurant is part of Phase 0 program
  const phase0RestaurantIds = [
    "rest_001",
    "rest_002",
    "rest_003",
    "rest_004",
    "rest_005",
    "rest_006",
    "rest_007",
    "rest_008",
    "rest_009",
    "rest_010",
  ]
  return phase0RestaurantIds.includes(restaurantId)
}

export function getPhase0TrialEndDate(): Date {
  const startDate = new Date("2024-01-01") // Phase 0 start date
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + PHASE0_CONFIG.trialPeriodDays)
  return endDate
}

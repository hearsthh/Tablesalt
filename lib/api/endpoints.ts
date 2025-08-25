// =====================================================
// API ENDPOINTS STRUCTURE FOR TABLESALT AI
// =====================================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
  },

  // Organizations
  ORGANIZATIONS: {
    GET_CURRENT: "/api/v1/organizations/current",
    UPDATE: "/api/v1/organizations/current",
    GET_USAGE: "/api/v1/organizations/usage",
    GET_BILLING: "/api/v1/organizations/billing",
    UPDATE_BILLING: "/api/v1/organizations/billing",
    GET_USERS: "/api/v1/organizations/users",
    INVITE_USER: "/api/v1/organizations/users/invite",
    UPDATE_USER_ROLE: (userId: string) => `/api/v1/organizations/users/${userId}/role`,
    REMOVE_USER: (userId: string) => `/api/v1/organizations/users/${userId}`,
  },

  // Restaurants
  RESTAURANTS: {
    GET_ALL: "/api/v1/restaurants",
    GET_BY_ID: (id: string) => `/api/v1/restaurants/${id}`,
    CREATE: "/api/v1/restaurants",
    UPDATE: (id: string) => `/api/v1/restaurants/${id}`,
    DELETE: (id: string) => `/api/v1/restaurants/${id}`,
    GET_SETTINGS: (id: string) => `/api/v1/restaurants/${id}/settings`,
    UPDATE_SETTINGS: (id: string) => `/api/v1/restaurants/${id}/settings`,
  },

  // Menu Management
  MENU: {
    // Categories
    CATEGORIES: {
      GET_ALL: "/api/v1/menu/categories",
      CREATE: "/api/v1/menu/categories",
      UPDATE: (id: string) => `/api/v1/menu/categories/${id}`,
      DELETE: (id: string) => `/api/v1/menu/categories/${id}`,
      REORDER: "/api/v1/menu/categories/reorder",
    },

    // Items
    ITEMS: {
      GET_ALL: "/api/v1/menu/items",
      GET_BY_ID: (id: string) => `/api/v1/menu/items/${id}`,
      CREATE: "/api/v1/menu/items",
      UPDATE: (id: string) => `/api/v1/menu/items/${id}`,
      DELETE: (id: string) => `/api/v1/menu/items/${id}`,
      BULK_UPDATE: "/api/v1/menu/items/bulk-update",
      BULK_DELETE: "/api/v1/menu/items/bulk-delete",
      REORDER: "/api/v1/menu/items/reorder",
      TOGGLE_STOCK: (id: string) => `/api/v1/menu/items/${id}/toggle-stock`,
      UPLOAD_IMAGE: (id: string) => `/api/v1/menu/items/${id}/image`,
      GET_ANALYTICS: (id: string) => `/api/v1/menu/items/${id}/analytics`,
    },

    // Variants
    VARIANTS: {
      GET_BY_ITEM: (itemId: string) => `/api/v1/menu/items/${itemId}/variants`,
      CREATE: (itemId: string) => `/api/v1/menu/items/${itemId}/variants`,
      UPDATE: (itemId: string, variantId: string) => `/api/v1/menu/items/${itemId}/variants/${variantId}`,
      DELETE: (itemId: string, variantId: string) => `/api/v1/menu/items/${itemId}/variants/${variantId}`,
    },

    // Modifiers
    MODIFIERS: {
      GET_BY_ITEM: (itemId: string) => `/api/v1/menu/items/${itemId}/modifiers`,
      CREATE: (itemId: string) => `/api/v1/menu/items/${itemId}/modifiers`,
      UPDATE: (itemId: string, modifierId: string) => `/api/v1/menu/items/${itemId}/modifiers/${modifierId}`,
      DELETE: (itemId: string, modifierId: string) => `/api/v1/menu/items/${itemId}/modifiers/${modifierId}`,
    },

    // Combos
    COMBOS: {
      GET_ALL: "/api/v1/menu/combos",
      GET_BY_ID: (id: string) => `/api/v1/menu/combos/${id}`,
      CREATE: "/api/v1/menu/combos",
      UPDATE: (id: string) => `/api/v1/menu/combos/${id}`,
      DELETE: (id: string) => `/api/v1/menu/combos/${id}`,
      TOGGLE_ACTIVE: (id: string) => `/api/v1/menu/combos/${id}/toggle-active`,
    },

    // Import/Export
    IMPORT: "/api/v1/menu/import",
    EXPORT: "/api/v1/menu/export",
    TEMPLATES: "/api/v1/menu/templates",
    APPLY_TEMPLATE: "/api/v1/menu/apply-template",

    // Publishing
    PUBLISH: "/api/v1/menu/publish",
    UNPUBLISH: "/api/v1/menu/unpublish",
    GET_PUBLIC_MENU: (slug: string) => `/api/v1/menu/public/${slug}`,
    GENERATE_QR: "/api/v1/menu/qr-code",

    // Analytics
    ANALYTICS: "/api/v1/menu/analytics",
    PERFORMANCE: "/api/v1/menu/performance",
    INSIGHTS: "/api/v1/menu/insights",
  },

  // AI Features
  AI: {
    // Menu Enhancement
    ENHANCE_DESCRIPTIONS: "/api/v1/ai/enhance-descriptions",
    GENERATE_TAGS: "/api/v1/ai/generate-tags",
    OPTIMIZE_PRICING: "/api/v1/ai/optimize-pricing",
    SUGGEST_COMBOS: "/api/v1/ai/suggest-combos",
    REORDER_MENU: "/api/v1/ai/reorder-menu",

    // Design
    DESIGN_TEMPLATES: "/api/v1/ai/design/templates",
    GENERATE_DESIGN: "/api/v1/ai/design/generate",
    APPLY_DESIGN: "/api/v1/ai/design/apply",

    // Insights
    GENERATE_INSIGHTS: "/api/v1/ai/insights/generate",
    GET_INSIGHTS: "/api/v1/ai/insights",
    APPLY_INSIGHT: (id: string) => `/api/v1/ai/insights/${id}/apply`,
    DISMISS_INSIGHT: (id: string) => `/api/v1/ai/insights/${id}/dismiss`,

    // Content Generation
    GENERATE_CONTENT: "/api/v1/ai/generate-content",
    ENHANCE_CONTENT: "/api/v1/ai/enhance-content",
  },

  // Customers
  CUSTOMERS: {
    GET_ALL: "/api/v1/customers",
    GET_BY_ID: (id: string) => `/api/v1/customers/${id}`,
    CREATE: "/api/v1/customers",
    UPDATE: (id: string) => `/api/v1/customers/${id}`,
    DELETE: (id: string) => `/api/v1/customers/${id}`,
    BULK_UPDATE: "/api/v1/customers/bulk-update",
    BULK_DELETE: "/api/v1/customers/bulk-delete",
    IMPORT: "/api/v1/customers/import",
    EXPORT: "/api/v1/customers/export",
    GET_SEGMENTS: "/api/v1/customers/segments",
    GET_ANALYTICS: "/api/v1/customers/analytics",
    GET_ORDERS: (id: string) => `/api/v1/customers/${id}/orders`,
    GET_REVIEWS: (id: string) => `/api/v1/customers/${id}/reviews`,
    SYNC: "/api/v1/customers/sync",
  },

  // Orders
  ORDERS: {
    GET_ALL: "/api/v1/orders",
    GET_BY_ID: (id: string) => `/api/v1/orders/${id}`,
    CREATE: "/api/v1/orders",
    UPDATE: (id: string) => `/api/v1/orders/${id}`,
    DELETE: (id: string) => `/api/v1/orders/${id}`,
    GET_ANALYTICS: "/api/v1/orders/analytics",
    SYNC: "/api/v1/orders/sync",
  },

  // Reviews
  REVIEWS: {
    GET_ALL: "/api/v1/reviews",
    GET_BY_ID: (id: string) => `/api/v1/reviews/${id}`,
    CREATE: "/api/v1/reviews",
    UPDATE: (id: string) => `/api/v1/reviews/${id}`,
    DELETE: (id: string) => `/api/v1/reviews/${id}`,
    RESPOND: (id: string) => `/api/v1/reviews/${id}/respond`,
    GET_ANALYTICS: "/api/v1/reviews/analytics",
    SYNC: "/api/v1/reviews/sync",
    GET_SENTIMENT: "/api/v1/reviews/sentiment",
  },

  // Communications
  COMMUNICATIONS: {
    SEND: "/api/v1/communications/send",
    GET_HISTORY: "/api/v1/communications/history",
    GET_TEMPLATES: "/api/v1/communications/templates",
    CREATE_TEMPLATE: "/api/v1/communications/templates",
    UPDATE_TEMPLATE: (id: string) => `/api/v1/communications/templates/${id}`,
    DELETE_TEMPLATE: (id: string) => `/api/v1/communications/templates/${id}`,
    GET_ANALYTICS: "/api/v1/communications/analytics",
    GENERATE_AI_CONTENT: "/api/v1/communications/ai-generate",
  },

  // Marketing
  MARKETING: {
    CAMPAIGNS: {
      GET_ALL: "/api/v1/marketing/campaigns",
      GET_BY_ID: (id: string) => `/api/v1/marketing/campaigns/${id}`,
      CREATE: "/api/v1/marketing/campaigns",
      UPDATE: (id: string) => `/api/v1/marketing/campaigns/${id}`,
      DELETE: (id: string) => `/api/v1/marketing/campaigns/${id}`,
      LAUNCH: (id: string) => `/api/v1/marketing/campaigns/${id}/launch`,
      PAUSE: (id: string) => `/api/v1/marketing/campaigns/${id}/pause`,
      GET_ANALYTICS: (id: string) => `/api/v1/marketing/campaigns/${id}/analytics`,
    },
    STRATEGIES: "/api/v1/marketing/strategies",
    CALENDAR: "/api/v1/marketing/calendar",
    ANALYTICS: "/api/v1/marketing/analytics",
  },

  // Integrations
  INTEGRATIONS: {
    GET_ALL: "/api/v1/integrations",
    GET_BY_ID: (id: string) => `/api/v1/integrations/${id}`,
    CREATE: "/api/v1/integrations",
    UPDATE: (id: string) => `/api/v1/integrations/${id}`,
    DELETE: (id: string) => `/api/v1/integrations/${id}`,
    CONNECT: (id: string) => `/api/v1/integrations/${id}/connect`,
    DISCONNECT: (id: string) => `/api/v1/integrations/${id}/disconnect`,
    SYNC: (id: string) => `/api/v1/integrations/${id}/sync`,
    GET_AVAILABLE: "/api/v1/integrations/available",
    TEST_CONNECTION: (id: string) => `/api/v1/integrations/${id}/test`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: "/api/v1/analytics/dashboard",
    CUSTOMERS: "/api/v1/analytics/customers",
    REVENUE: "/api/v1/analytics/revenue",
    MENU: "/api/v1/analytics/menu",
    MARKETING: "/api/v1/analytics/marketing",
    REPORTS: {
      GENERATE: "/api/v1/analytics/reports",
      GET_BY_ID: (id: string) => `/api/v1/analytics/reports/${id}`,
      DOWNLOAD: (id: string) => `/api/v1/analytics/reports/${id}/download`,
    },
    EXPORT: "/api/v1/analytics/export",
  },

  // Notifications
  NOTIFICATIONS: {
    GET_ALL: "/api/v1/notifications",
    GET_BY_ID: (id: string) => `/api/v1/notifications/${id}`,
    MARK_AS_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_AS_READ: "/api/v1/notifications/read-all",
    DELETE: (id: string) => `/api/v1/notifications/${id}`,
    GET_SETTINGS: "/api/v1/notifications/settings",
    UPDATE_SETTINGS: "/api/v1/notifications/settings",
  },

  // File Management
  FILES: {
    UPLOAD: "/api/v1/files/upload",
    DELETE: (id: string) => `/api/v1/files/${id}`,
    GET_SIGNED_URL: "/api/v1/files/signed-url",
  },

  // Webhooks
  WEBHOOKS: {
    RECEIVE: "/api/v1/webhooks",
    POS_ORDERS: "/api/v1/webhooks/pos/orders",
    DELIVERY_ORDERS: "/api/v1/webhooks/delivery/orders",
    REVIEWS: "/api/v1/webhooks/reviews",
  },
} as const

// Helper function to build URLs with query parameters
export function buildApiUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${endpoint}?${queryString}` : endpoint
}

// Type-safe API endpoint builder
export class ApiEndpointBuilder {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  // Menu endpoints
  menu = {
    items: {
      getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
        buildApiUrl(`${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.GET_ALL}`, params),

      getById: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.GET_BY_ID(id)}`,

      create: () => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.CREATE}`,

      update: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.UPDATE(id)}`,

      delete: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.DELETE(id)}`,

      bulkUpdate: () => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.BULK_UPDATE}`,

      toggleStock: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.TOGGLE_STOCK(id)}`,

      uploadImage: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.ITEMS.UPLOAD_IMAGE(id)}`,
    },

    categories: {
      getAll: () => `${this.baseUrl}${API_ENDPOINTS.MENU.CATEGORIES.GET_ALL}`,
      create: () => `${this.baseUrl}${API_ENDPOINTS.MENU.CATEGORIES.CREATE}`,
      update: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.CATEGORIES.UPDATE(id)}`,
      delete: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.CATEGORIES.DELETE(id)}`,
      reorder: () => `${this.baseUrl}${API_ENDPOINTS.MENU.CATEGORIES.REORDER}`,
    },

    combos: {
      getAll: () => `${this.baseUrl}${API_ENDPOINTS.MENU.COMBOS.GET_ALL}`,
      create: () => `${this.baseUrl}${API_ENDPOINTS.MENU.COMBOS.CREATE}`,
      update: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.COMBOS.UPDATE(id)}`,
      delete: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.COMBOS.DELETE(id)}`,
      toggleActive: (id: string) => `${this.baseUrl}${API_ENDPOINTS.MENU.COMBOS.TOGGLE_ACTIVE(id)}`,
    },

    publish: () => `${this.baseUrl}${API_ENDPOINTS.MENU.PUBLISH}`,
    unpublish: () => `${this.baseUrl}${API_ENDPOINTS.MENU.UNPUBLISH}`,
    analytics: () => `${this.baseUrl}${API_ENDPOINTS.MENU.ANALYTICS}`,
    insights: () => `${this.baseUrl}${API_ENDPOINTS.MENU.INSIGHTS}`,
  }

  // AI endpoints
  ai = {
    enhanceDescriptions: () => `${this.baseUrl}${API_ENDPOINTS.AI.ENHANCE_DESCRIPTIONS}`,
    generateTags: () => `${this.baseUrl}${API_ENDPOINTS.AI.GENERATE_TAGS}`,
    optimizePricing: () => `${this.baseUrl}${API_ENDPOINTS.AI.OPTIMIZE_PRICING}`,
    suggestCombos: () => `${this.baseUrl}${API_ENDPOINTS.AI.SUGGEST_COMBOS}`,
    reorderMenu: () => `${this.baseUrl}${API_ENDPOINTS.AI.REORDER_MENU}`,
    generateDesign: () => `${this.baseUrl}${API_ENDPOINTS.AI.DESIGN_TEMPLATES}`,
    applyDesign: () => `${this.baseUrl}${API_ENDPOINTS.AI.APPLY_DESIGN}`,
    generateInsights: () => `${this.baseUrl}${API_ENDPOINTS.AI.GENERATE_INSIGHTS}`,
    getInsights: () => `${this.baseUrl}${API_ENDPOINTS.AI.GET_INSIGHTS}`,
  }

  // Customer endpoints
  customers = {
    getAll: (params?: { search?: string; segment?: string; page?: number; limit?: number }) =>
      buildApiUrl(`${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.GET_ALL}`, params),

    getById: (id: string) => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id)}`,

    create: () => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.CREATE}`,

    update: (id: string) => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.UPDATE(id)}`,

    delete: (id: string) => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.DELETE(id)}`,

    bulkUpdate: () => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.BULK_UPDATE}`,

    import: () => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.IMPORT}`,

    export: () => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.EXPORT}`,

    getSegments: () => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.GET_SEGMENTS}`,

    getAnalytics: () => `${this.baseUrl}${API_ENDPOINTS.CUSTOMERS.GET_ANALYTICS}`,
  }

  // Analytics endpoints
  analytics = {
    dashboard: () => `${this.baseUrl}${API_ENDPOINTS.ANALYTICS.DASHBOARD}`,
    customers: () => `${this.baseUrl}${API_ENDPOINTS.ANALYTICS.CUSTOMERS}`,
    revenue: (params?: { period?: string }) => buildApiUrl(`${this.baseUrl}${API_ENDPOINTS.ANALYTICS.REVENUE}`, params),
    menu: () => `${this.baseUrl}${API_ENDPOINTS.ANALYTICS.MENU}`,
    marketing: () => `${this.baseUrl}${API_ENDPOINTS.ANALYTICS.MARKETING}`,
    generateReport: () => `${this.baseUrl}${API_ENDPOINTS.ANALYTICS.REPORTS.GENERATE}`,
    getReport: (id: string) => `${this.baseUrl}${API_ENDPOINTS.ANALYTICS.REPORTS.GET_BY_ID(id)}`,
  }

  // Integration endpoints
  integrations = {
    getAll: () => `${this.baseUrl}${API_ENDPOINTS.INTEGRATIONS.GET_ALL}`,
    connect: (id: string) => `${this.baseUrl}${API_ENDPOINTS.INTEGRATIONS.CONNECT(id)}`,
    disconnect: (id: string) => `${this.baseUrl}${API_ENDPOINTS.INTEGRATIONS.DISCONNECT(id)}`,
    sync: (id: string) => `${this.baseUrl}${API_ENDPOINTS.INTEGRATIONS.SYNC(id)}`,
    testConnection: (id: string) => `${this.baseUrl}${API_ENDPOINTS.INTEGRATIONS.TEST_CONNECTION(id)}`,
  }

  // Communication endpoints
  communications = {
    send: () => `${this.baseUrl}${API_ENDPOINTS.COMMUNICATIONS.SEND}`,
    getHistory: (params?: { customerId?: string; page?: number; limit?: number }) =>
      buildApiUrl(`${this.baseUrl}${API_ENDPOINTS.COMMUNICATIONS.GET_HISTORY}`, params),
    getTemplates: () => `${this.baseUrl}${API_ENDPOINTS.COMMUNICATIONS.GET_TEMPLATES}`,
    generateAIContent: () => `${this.baseUrl}${API_ENDPOINTS.COMMUNICATIONS.GENERATE_AI_CONTENT}`,
    getAnalytics: () => `${this.baseUrl}${API_ENDPOINTS.COMMUNICATIONS.GET_ANALYTICS}`,
  }
}

// Default API builder instance
export const apiEndpoints = new ApiEndpointBuilder()

// Request/Response Types for better type safety
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      pages: number
    }
    filters?: Record<string, any>
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

// Common request parameters
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams {
  search?: string
  sort?: string
  order?: "asc" | "desc"
}

export interface FilterParams {
  filters?: Record<string, any>
}

export type CommonParams = PaginationParams & SearchParams & FilterParams

// Menu-specific types
export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  costPrice?: number
  categoryId?: string
  imageUrl?: string
  isAvailable: boolean
  isFeatured: boolean
  preparationTime?: number
  spiceLevel?: number
  allergens?: string[]
  dietaryTags?: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
    sugar?: number
    sodium?: number
  }
  createdAt: string
  updatedAt: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  sortOrder: number
  isActive: boolean
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface MenuCombo {
  id: string
  name: string
  description?: string
  price: number
  items: {
    itemId: string
    quantity: number
    variantId?: string
  }[]
  isActive: boolean
  validFrom?: string
  validTo?: string
  createdAt: string
  updatedAt: string
}

// Customer types
export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  preferences?: Record<string, any>
  segment?: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  createdAt: string
  updatedAt: string
}

// Order types
export interface Order {
  id: string
  customerId?: string
  orderNumber: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  orderType: "dine_in" | "takeout" | "delivery"
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  menuItemId: string
  variantId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  modifiers?: any[]
  specialInstructions?: string
}

// Review types
export interface Review {
  id: string
  customerId?: string
  platform: string
  rating: number
  title?: string
  content: string
  response?: string
  respondedAt?: string
  isPublic: boolean
  sentiment?: "positive" | "neutral" | "negative"
  createdAt: string
  updatedAt: string
}

// Campaign types
export interface Campaign {
  id: string
  name: string
  description?: string
  type: "email" | "sms" | "push" | "social"
  status: "draft" | "scheduled" | "active" | "paused" | "completed"
  targetAudience: any
  content: any
  scheduledAt?: string
  sentAt?: string
  metrics?: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
  }
  createdAt: string
  updatedAt: string
}

// Integration types
export interface Integration {
  id: string
  platform: string
  name: string
  status: "connected" | "disconnected" | "error"
  config: Record<string, any>
  lastSyncAt?: string
  createdAt: string
  updatedAt: string
}

// AI Insight types
export interface AIInsight {
  id: string
  type: "menu_optimization" | "pricing" | "customer_behavior" | "marketing"
  title: string
  description: string
  impact: "low" | "medium" | "high"
  status: "new" | "applied" | "dismissed"
  data: any
  createdAt: string
  updatedAt: string
}

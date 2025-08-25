// API Requirements for Setup Page

export interface SetupPageAPIRequirements {
  // Core setup data
  setupSections: SetupSection[]
  overallProgress: number
  
  // Integration data
  integrations: IntegrationStatus[]
  
  // Analytics data
  posAnalytics?: POSAnalytics
  deliveryAnalytics?: DeliveryAnalytics
  reviewsAnalytics?: ReviewsAnalytics
  reservationAnalytics?: ReservationAnalytics
}

export interface SetupSection {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  fields: number
  completed: number
  status: 'completed' | 'in-progress' | 'pending'
  lastUpdated?: string
}

export interface IntegrationStatus {
  id: string
  name: string
  category: string
  connected: boolean
  lastSync?: string
  dataCount?: number
  dataType?: string
  sectionId: string
}

export interface POSAnalytics {
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  orderTypes: {
    dineIn: { count: number; percentage: number; revenue: number }
    takeaway: { count: number; percentage: number; revenue: number }
    delivery: { count: number; percentage: number; revenue: number }
  }
  peakHours: {
    lunch: { time: string; orders: number }
    dinner: { time: string; orders: number }
  }
  topItems: Array<{ name: string; orders: number }>
  paymentMethods: {
    card: { percentage: number; amount: number }
    mobile: { percentage: number; amount: number }
    cash: { percentage: number; amount: number }
  }
}

export interface DeliveryAnalytics {
  totalOrders: number
  totalRevenue: number
  avgDeliveryTime: number
  avgRating: number
  platformBreakdown: Array<{
    platform: string
    orders: number
    revenue: number
  }>
}

export interface ReviewsAnalytics {
  totalReviews: number
  avgRating: number
  recentReviews: number
  sentimentBreakdown: {
    positive: number
    neutral: number
    negative: number
  }
  platformBreakdown: Array<{
    platform: string
    reviews: number
    avgRating: number
  }>
}

export interface ReservationAnalytics {
  totalReservations: number
  conversionRate: number
  avgPartySize: number
  peakTimes: Array<{
    day: string
    time: string
    reservations: number
  }>
}

// API Endpoint Definitions
export const SETUP_API_ENDPOINTS = {
  // Setup progress
  getSetupProgress: 'GET /api/setup/progress',
  getSetupSections: 'GET /api/setup/sections',
  updateSectionProgress: 'PUT /api/setup/sections/{sectionId}/progress',
  
  // Integrations
  getIntegrations: 'GET /api/integrations',
  getSectionIntegrations: 'GET /api/integrations/section/{sectionId}',
  connectIntegration: 'POST /api/integrations/{integrationId}/connect',
  disconnectIntegration: 'DELETE /api/integrations/{integrationId}',
  syncIntegration: 'POST /api/integrations/{integrationId}/sync',
  
  // Analytics
  getPOSAnalytics: 'GET /api/analytics/pos',
  getDeliveryAnalytics: 'GET /api/analytics/delivery',
  getReviewsAnalytics: 'GET /api/analytics/reviews',
  getReservationAnalytics: 'GET /api/analytics/reservations',
  
  // Section-specific data
  getRestaurantInfo: 'GET /api/setup/restaurant-info',
  updateRestaurantInfo: 'PUT /api/setup/restaurant-info',
  getMenuData: 'GET /api/setup/menu',
  updateMenuData: 'PUT /api/setup/menu',
  getCustomerData: 'GET /api/setup/customers',
  updateCustomerData: 'PUT /api/setup/customers'
} as const

// Request/Response Types
export interface SetupProgressResponse {
  overallProgress: number
  sections: SetupSection[]
  lastUpdated: string
}

export interface IntegrationsResponse {
  integrations: IntegrationStatus[]
  availableIntegrations: Array<{
    id: string
    name: string
    category: string
    description: string
    logo: string
    fields: string[]
  }>
}

export interface ConnectIntegrationRequest {
  integrationId: string
  credentials?: Record<string, any>
  selectedFields?: string[]
}

export interface SyncIntegrationResponse {
  success: boolean
  syncedAt: string
  recordsImported: number
  errors?: string[]
}

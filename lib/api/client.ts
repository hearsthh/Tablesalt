import { useAuthStore } from '@/lib/store'

// =====================================================
// API CLIENT CONFIGURATION
// =====================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// =====================================================
// HTTP CLIENT
// =====================================================

class HTTPClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get auth token
    const { accessToken, refreshAuth } = useAuthStore.getState()
    
    // Default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add auth header if token exists
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    // Add organization context
    const { organization, currentRestaurant } = useAuthStore.getState()
    if (organization) {
      headers['X-Organization-ID'] = organization.id
    }
    if (currentRestaurant) {
      headers['X-Restaurant-ID'] = currentRestaurant.id
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle 401 - try to refresh token
      if (response.status === 401 && accessToken) {
        try {
          await refreshAuth()
          // Retry with new token
          const newToken = useAuthStore.getState().accessToken
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            })
            return this.handleResponse<T>(retryResponse)
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          useAuthStore.getState().logout()
          throw new APIError('Authentication failed', 401, 'AUTH_FAILED')
        }
      }

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(
        'Network error occurred',
        0,
        'NETWORK_ERROR',
        error
      )
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJSON = contentType?.includes('application/json')

    let data: any
    if (isJSON) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      throw new APIError(
        data.message || `HTTP ${response.status}`,
        response.status,
        data.code,
        data.details
      )
    }

    return data
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint
    
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new HTTPClient(API_BASE_URL)

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface APIResponse<T> {
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

// =====================================================
// CUSTOMERS API
// =====================================================

export interface CustomerFilters {
  search?: string
  segment?: string
  status?: string
  churnRisk?: string
  page?: number
  limit?: number
}

export interface CreateCustomerData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  preferredContactMethod?: 'email' | 'phone' | 'sms' | 'none'
  emailMarketingConsent?: boolean
  smsMarketingConsent?: boolean
  dietaryPreferences?: string[]
  allergens?: string[]
  favoriteCuisines?: string[]
  spicePreference?: number
  primaryAddress?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

export const customersAPI = {
  getAll: (filters?: CustomerFilters) =>
    apiClient.get<APIResponse<PaginatedResponse<Customer>>>('/customers', filters),

  getById: (id: string) =>
    apiClient.get<APIResponse<Customer>>(`/customers/${id}`),

  create: (data: CreateCustomerData) =>
    apiClient.post<APIResponse<Customer>>('/customers', data),

  update: (id: string, data: Partial<CreateCustomerData>) =>
    apiClient.put<APIResponse<Customer>>(`/customers/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<APIResponse<void>>(`/customers/${id}`),

  getSegments: () =>
    apiClient.get<APIResponse<any[]>>('/customers/segments'),

  getAnalytics: () =>
    apiClient.get<APIResponse<any>>('/customers/analytics'),

  bulkUpdate: (customerIds: string[], updates: Partial<CreateCustomerData>) =>
    apiClient.post<APIResponse<void>>('/customers/bulk-update', {
      customerIds,
      updates
    }),

  export: (filters?: CustomerFilters) =>
    apiClient.get<Blob>('/customers/export', filters),

  import: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`${API_BASE_URL}/customers/import`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    })
  }
}

// =====================================================
// COMMUNICATIONS API
// =====================================================

export interface SendCommunicationData {
  customerIds: string[]
  type: 'ai_offer' | 'thank_you' | 'win_back' | 'apology' | 'birthday' | 'feedback' | 'custom'
  channel: 'email' | 'sms' | 'whatsapp'
  customMessage?: string
  scheduledAt?: string
}

export const communicationsAPI = {
  send: (data: SendCommunicationData) =>
    apiClient.post<APIResponse<{ jobId: string }>>('/communications/send', data),

  getHistory: (customerId?: string) =>
    apiClient.get<APIResponse<any[]>>('/communications/history', 
      customerId ? { customerId } : undefined),

  getTemplates: () =>
    apiClient.get<APIResponse<any[]>>('/communications/templates'),

  createTemplate: (template: any) =>
    apiClient.post<APIResponse<any>>('/communications/templates', template),

  getAnalytics: () =>
    apiClient.get<APIResponse<any>>('/communications/analytics'),

  generateAIContent: (customerId: string, type: string) =>
    apiClient.post<APIResponse<any>>('/communications/ai-generate', {
      customerId,
      type
    })
}

// =====================================================
// NOTIFICATIONS API
// =====================================================

export const notificationsAPI = {
  getAll: () =>
    apiClient.get<APIResponse<Notification[]>>('/notifications'),

  markAsRead: (id: string) =>
    apiClient.put<APIResponse<void>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put<APIResponse<void>>('/notifications/read-all'),

  delete: (id: string) =>
    apiClient.delete<APIResponse<void>>(`/notifications/${id}`),

  getSettings: () =>
    apiClient.get<APIResponse<any>>('/notifications/settings'),

  updateSettings: (settings: any) =>
    apiClient.put<APIResponse<any>>('/notifications/settings', settings)
}

// =====================================================
// ANALYTICS API
// =====================================================

export const analyticsAPI = {
  getDashboard: () =>
    apiClient.get<APIResponse<any>>('/analytics/dashboard'),

  getCustomerAnalytics: () =>
    apiClient.get<APIResponse<any>>('/analytics/customers'),

  getRevenueAnalytics: (period?: string) =>
    apiClient.get<APIResponse<any>>('/analytics/revenue', 
      period ? { period } : undefined),

  getMenuAnalytics: () =>
    apiClient.get<APIResponse<any>>('/analytics/menu'),

  getMarketingAnalytics: () =>
    apiClient.get<APIResponse<any>>('/analytics/marketing'),

  generateReport: (type: string, filters?: any) =>
    apiClient.post<APIResponse<{ reportId: string }>>('/analytics/reports', {
      type,
      filters
    }),

  getReport: (reportId: string) =>
    apiClient.get<APIResponse<any>>(`/analytics/reports/${reportId}`)
}

// =====================================================
// ORGANIZATIONS API
// =====================================================

export const organizationsAPI = {
  getCurrent: () =>
    apiClient.get<APIResponse<Organization>>('/organizations/current'),

  update: (data: Partial<Organization>) =>
    apiClient.put<APIResponse<Organization>>('/organizations/current', data),

  getUsage: () =>
    apiClient.get<APIResponse<any>>('/organizations/usage'),

  getBilling: () =>
    apiClient.get<APIResponse<any>>('/organizations/billing'),

  updateBilling: (data: any) =>
    apiClient.put<APIResponse<any>>('/organizations/billing', data),

  getUsers: () =>
    apiClient.get<APIResponse<User[]>>('/organizations/users'),

  inviteUser: (email: string, role: string) =>
    apiClient.post<APIResponse<void>>('/organizations/users/invite', {
      email,
      role
    }),

  updateUserRole: (userId: string, role: string) =>
    apiClient.put<APIResponse<void>>(`/organizations/users/${userId}/role`, {
      role
    }),

  removeUser: (userId: string) =>
    apiClient.delete<APIResponse<void>>(`/organizations/users/${userId}`)
}

// =====================================================
// RESTAURANTS API
// =====================================================

export const restaurantsAPI = {
  getAll: () =>
    apiClient.get<APIResponse<Restaurant[]>>('/restaurants'),

  getById: (id: string) =>
    apiClient.get<APIResponse<Restaurant>>(`/restaurants/${id}`),

  create: (data: Partial<Restaurant>) =>
    apiClient.post<APIResponse<Restaurant>>('/restaurants', data),

  update: (id: string, data: Partial<Restaurant>) =>
    apiClient.put<APIResponse<Restaurant>>(`/restaurants/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<APIResponse<void>>(`/restaurants/${id}`)
}

// =====================================================
// AUTH API
// =====================================================

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<APIResponse<{
      user: User
      organization: Organization
      accessToken: string
      refreshToken: string
    }>>('/auth/login', { email, password }),

  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    organizationName: string
  }) =>
    apiClient.post<APIResponse<{
      user: User
      organization: Organization
      accessToken: string
      refreshToken: string
    }>>('/auth/register', data),

  refresh: (refreshToken: string) =>
    apiClient.post<APIResponse<{
      accessToken: string
      refreshToken: string
    }>>('/auth/refresh', { refreshToken }),

  logout: () =>
    apiClient.post<APIResponse<void>>('/auth/logout'),

  forgotPassword: (email: string) =>
    apiClient.post<APIResponse<void>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<APIResponse<void>>('/auth/reset-password', {
      token,
      password
    }),

  verifyEmail: (token: string) =>
    apiClient.post<APIResponse<void>>('/auth/verify-email', { token }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<APIResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword
    })
}

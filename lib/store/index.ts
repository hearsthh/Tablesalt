import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { produce } from "immer"

// =====================================================
// TYPES
// =====================================================

export interface User {
  id: string
  organizationId: string
  email: string
  firstName: string
  lastName: string
  role: "owner" | "admin" | "manager" | "member" | "viewer"
  permissions: string[]
  preferences: {
    theme: "light" | "dark"
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    dashboardLayout: string
    timezone: string
    language: string
  }
  avatarUrl?: string
  lastLoginAt?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  subscriptionPlan: "starter" | "professional" | "enterprise" | "custom"
  subscriptionStatus: "trial" | "active" | "past_due" | "canceled" | "suspended"
  limits: {
    restaurants: number
    users: number
    customers: number
    menuItems: number
    monthlyEmails: number
    monthlySms: number
    apiCallsPerMonth: number
    storageGb: number
  }
  currentUsage: {
    restaurants: number
    users: number
    customers: number
    menuItems: number
    monthlyEmails: number
    monthlySms: number
    apiCallsThisMonth: number
    storageUsedGb: number
  }
  settings: {
    timezone: string
    currency: string
    dateFormat: string
    timeFormat: string
    language: string
    features: {
      aiInsights: boolean
      bulkCommunications: boolean
      advancedAnalytics: boolean
      apiAccess: boolean
      whiteLabel: boolean
      prioritySupport: boolean
    }
  }
}

export interface Restaurant {
  id: string
  organizationId: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  coverImageUrl?: string
  email?: string
  phone?: string
  website?: string
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    coordinates?: { lat: number; lng: number }
  }
  cuisineTypes: string[]
  priceRange?: "$" | "$$" | "$$$" | "$$$$"
  capacity?: number
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  settings: {
    timezone: string
    currency: string
    taxRate: number
    serviceCharge: number
    autoAcceptOrders: boolean
    orderPreparationTime: number
    deliveryRadiusKm: number
    minimumOrderAmount: number
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    yelp?: string
    googleBusiness?: string
  }
  status: "active" | "inactive" | "suspended" | "deleted"
}

export interface Customer {
  id: string
  restaurantId: string
  customerNumber?: string
  externalCustomerId?: string
  firstName?: string
  lastName?: string
  fullName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  preferredContactMethod: "email" | "phone" | "sms" | "none"
  emailMarketingConsent: boolean
  smsMarketingConsent: boolean
  addresses: any[]
  primaryAddress: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    coordinates?: { lat: number; lng: number }
  }
  dietaryPreferences: string[]
  allergens: string[]
  favoriteCuisines: string[]
  spicePreference?: number
  customerStatus: "active" | "inactive" | "blocked" | "deleted"
  customerTier: "new" | "regular" | "vip" | "premium"
  loyaltyMember: boolean
  loyaltyNumber?: string
  loyaltyPoints: number
  loyaltyTier?: string
  loyaltyJoinedDate?: string
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  lastOrderDate?: string
  firstOrderDate?: string
  avgDaysBetweenVisits?: number
  visitFrequencyCategory?: string
  daysSinceLastVisit?: number
  lifetimeValue: number
  predictedLifetimeValue?: number
  customerAcquisitionCost?: number
  preferredOrderTypes: string[]
  preferredOrderTimes: {
    breakfast: boolean
    lunch: boolean
    dinner: boolean
    lateNight: boolean
  }
  favoriteItems: string[]
  currentSegment?: string
  segmentLastCalculated?: string
  rfmScore?: string
  acquisitionSource?: string
  acquisitionCampaign?: string
  referralSource?: string
  utmParameters: any
  socialMediaHandles: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  reviewCount: number
  avgReviewRating?: number
  dataSource: string
  sourceSystem?: string
  importedAt?: string
  lastSyncedAt?: string
  gdprConsent: boolean
  gdprConsentDate?: string
  dataRetentionConsent: boolean
  createdAt: string
  updatedAt: string
  lastActivityAt: string
}

export interface Notification {
  id: string
  organizationId: string
  userId?: string
  type: "system" | "billing" | "feature" | "alert"
  title: string
  message: string
  data: any
  actionUrl?: string
  actionText?: string
  read: boolean
  readAt?: string
  priority: "low" | "normal" | "high" | "urgent"
  channels: string[]
  deliveredAt?: string
  createdAt: string
  expiresAt?: string
}

// =====================================================
// AUTH STORE
// =====================================================

interface AuthState {
  user: User | null
  organization: Organization | null
  currentRestaurant: Restaurant | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  updateOrganization: (updates: Partial<Organization>) => void
  setCurrentRestaurant: (restaurant: Restaurant) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => {
      const setImmer = (updater: (state: AuthState & AuthActions) => void) => set(produce(updater))

      return {
        // State
        user: null,
        organization: null,
        currentRestaurant: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (email: string, password: string) => {
          setImmer((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const response = await fetch("/api/v1/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
              throw new Error("Login failed")
            }

            const data = await response.json()

            setImmer((state) => {
              state.user = data.user
              state.organization = data.organization
              state.accessToken = data.accessToken
              state.refreshToken = data.refreshToken
              state.isAuthenticated = true
              state.isLoading = false
            })
          } catch (error) {
            setImmer((state) => {
              state.error = error instanceof Error ? error.message : "Login failed"
              state.isLoading = false
            })
          }
        },

        logout: () => {
          setImmer((state) => {
            state.user = null
            state.organization = null
            state.currentRestaurant = null
            state.accessToken = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.error = null
          })
        },

        refreshAuth: async () => {
          const { refreshToken } = get()
          if (!refreshToken) return

          try {
            const response = await fetch("/api/v1/auth/refresh", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            })

            if (!response.ok) {
              throw new Error("Token refresh failed")
            }

            const data = await response.json()

            setImmer((state) => {
              state.accessToken = data.accessToken
              state.refreshToken = data.refreshToken
            })
          } catch (_error) {
            get().logout()
          }
        },

        updateUser: (updates: Partial<User>) => {
          setImmer((state) => {
            if (state.user) {
              Object.assign(state.user, updates)
            }
          })
        },

        updateOrganization: (updates: Partial<Organization>) => {
          setImmer((state) => {
            if (state.organization) {
              Object.assign(state.organization, updates)
            }
          })
        },

        setCurrentRestaurant: (restaurant: Restaurant) => {
          setImmer((state) => {
            state.currentRestaurant = restaurant
          })
        },

        clearError: () => {
          setImmer((state) => {
            state.error = null
          })
        },
      }
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        currentRestaurant: state.currentRestaurant,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// =====================================================
// CUSTOMERS STORE
// =====================================================

interface CustomersState {
  customers: Customer[]
  selectedCustomers: string[]
  filters: {
    search: string
    segment: string
    status: string
    churnRisk: string
  }
  pagination: {
    page: number
    limit: number
    total: number
  }
  isLoading: boolean
  error: string | null
}

interface CustomersActions {
  fetchCustomers: () => Promise<void>
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
  selectCustomer: (id: string) => void
  deselectCustomer: (id: string) => void
  selectAllCustomers: () => void
  deselectAllCustomers: () => void
  setFilters: (filters: Partial<CustomersState["filters"]>) => void
  setPagination: (pagination: Partial<CustomersState["pagination"]>) => void
  clearError: () => void
}

export const useCustomersStore = create<CustomersState & CustomersActions>()((set, get) => {
  const setImmer = (updater: (state: CustomersState & CustomersActions) => void) => set(produce(updater))

  return {
    // State
    customers: [],
    selectedCustomers: [],
    filters: {
      search: "",
      segment: "all",
      status: "all",
      churnRisk: "all",
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },
    isLoading: false,
    error: null,

    // Actions
    fetchCustomers: async () => {
      setImmer((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const { filters, pagination } = get()
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          search: filters.search,
          segment: filters.segment,
          status: filters.status,
          churnRisk: filters.churnRisk,
        })

        const response = await fetch(`/api/v1/customers?${params}`)
        if (!response.ok) throw new Error("Failed to fetch customers")

        const data = await response.json()

        setImmer((state) => {
          state.customers = data.customers
          state.pagination.total = data.total
          state.isLoading = false
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to fetch customers"
          state.isLoading = false
        })
      }
    },

    addCustomer: async (customerData) => {
      try {
        const response = await fetch("/api/v1/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        })

        if (!response.ok) throw new Error("Failed to add customer")

        const newCustomer = await response.json()

        setImmer((state) => {
          state.customers.unshift(newCustomer)
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to add customer"
        })
      }
    },

    updateCustomer: async (id, updates) => {
      try {
        const response = await fetch(`/api/v1/customers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })

        if (!response.ok) throw new Error("Failed to update customer")

        const updatedCustomer = await response.json()

        setImmer((state) => {
          const index = state.customers.findIndex((c) => c.id === id)
          if (index !== -1) {
            state.customers[index] = updatedCustomer
          }
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to update customer"
        })
      }
    },

    deleteCustomer: async (id) => {
      try {
        const response = await fetch(`/api/v1/customers/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete customer")

        setImmer((state) => {
          state.customers = state.customers.filter((c) => c.id !== id)
          state.selectedCustomers = state.selectedCustomers.filter((cId) => cId !== id)
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to delete customer"
        })
      }
    },

    selectCustomer: (id) => {
      setImmer((state) => {
        if (!state.selectedCustomers.includes(id)) {
          state.selectedCustomers.push(id)
        }
      })
    },

    deselectCustomer: (id) => {
      setImmer((state) => {
        state.selectedCustomers = state.selectedCustomers.filter((cId) => cId !== id)
      })
    },

    selectAllCustomers: () => {
      setImmer((state) => {
        state.selectedCustomers = state.customers.map((c) => c.id)
      })
    },

    deselectAllCustomers: () => {
      setImmer((state) => {
        state.selectedCustomers = []
      })
    },

    setFilters: (newFilters) => {
      setImmer((state) => {
        Object.assign(state.filters, newFilters)
        state.pagination.page = 1 // Reset to first page when filtering
      })
    },

    setPagination: (newPagination) => {
      setImmer((state) => {
        Object.assign(state.pagination, newPagination)
      })
    },

    clearError: () => {
      setImmer((state) => {
        state.error = null
      })
    },
  }
})

// =====================================================
// NOTIFICATIONS STORE
// =====================================================

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

interface NotificationsActions {
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  clearError: () => void
}

export const useNotificationsStore = create<NotificationsState & NotificationsActions>()((set) => {
  const setImmer = (updater: (state: NotificationsState & NotificationsActions) => void) => set(produce(updater))

  return {
    // State
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    // Actions
    fetchNotifications: async () => {
      setImmer((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await fetch("/api/v1/notifications")
        if (!response.ok) throw new Error("Failed to fetch notifications")

        const data = await response.json()

        setImmer((state) => {
          state.notifications = data.notifications
          state.unreadCount = data.notifications.filter((n: Notification) => !n.read).length
          state.isLoading = false
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to fetch notifications"
          state.isLoading = false
        })
      }
    },

    markAsRead: async (id) => {
      try {
        const response = await fetch(`/api/v1/notifications/${id}/read`, {
          method: "PUT",
        })

        if (!response.ok) throw new Error("Failed to mark notification as read")

        setImmer((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          if (notification && !notification.read) {
            notification.read = true
            notification.readAt = new Date().toISOString()
            state.unreadCount -= 1
          }
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to mark notification as read"
        })
      }
    },

    markAllAsRead: async () => {
      try {
        const response = await fetch("/api/v1/notifications/read-all", {
          method: "PUT",
        })

        if (!response.ok) throw new Error("Failed to mark all notifications as read")

        setImmer((state) => {
          state.notifications.forEach((notification) => {
            if (!notification.read) {
              notification.read = true
              notification.readAt = new Date().toISOString()
            }
          })
          state.unreadCount = 0
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to mark all notifications as read"
        })
      }
    },

    deleteNotification: async (id) => {
      try {
        const response = await fetch(`/api/v1/notifications/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete notification")

        setImmer((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          if (notification && !notification.read) {
            state.unreadCount -= 1
          }
          state.notifications = state.notifications.filter((n) => n.id !== id)
        })
      } catch (error) {
        setImmer((state) => {
          state.error = error instanceof Error ? error.message : "Failed to delete notification"
        })
      }
    },

    addNotification: (notificationData) => {
      const notification: Notification = {
        ...notificationData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      setImmer((state) => {
        state.notifications.unshift(notification)
        if (!notification.read) {
          state.unreadCount += 1
        }
      })
    },

    clearError: () => {
      setImmer((state) => {
        state.error = null
      })
    },
  }
})

// =====================================================
// UI STORE
// =====================================================

interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark"
  loading: {
    [key: string]: boolean
  }
  modals: {
    [key: string]: boolean
  }
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: "light" | "dark") => void
  setLoading: (key: string, loading: boolean) => void
  openModal: (key: string) => void
  closeModal: (key: string) => void
  toggleModal: (key: string) => void
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => {
      const setImmer = (updater: (state: UIState & UIActions) => void) => set(produce(updater))

      return {
        // State
        sidebarOpen: true,
        theme: "light",
        loading: {},
        modals: {},

        // Actions
        toggleSidebar: () => {
          setImmer((state) => {
            state.sidebarOpen = !state.sidebarOpen
          })
        },

        setSidebarOpen: (open) => {
          setImmer((state) => {
            state.sidebarOpen = open
          })
        },

        setTheme: (theme) => {
          setImmer((state) => {
            state.theme = theme
          })
        },

        setLoading: (key, loading) => {
          setImmer((state) => {
            state.loading[key] = loading
          })
        },

        openModal: (key) => {
          setImmer((state) => {
            state.modals[key] = true
          })
        },

        closeModal: (key) => {
          setImmer((state) => {
            state.modals[key] = false
          })
        },

        toggleModal: (key) => {
          setImmer((state) => {
            state.modals[key] = !state.modals[key]
          })
        },
      }
    },
    {
      name: "ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    },
  ),
)

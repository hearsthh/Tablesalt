import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  image_url?: string
  dietary_tags: string[]
  allergens: string[]
  is_available: boolean
  popularity_score: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  display_order: number
  is_active: boolean
  items: MenuItem[]
}

export interface Restaurant {
  id: string
  name: string
  description: string
  cuisine_type: string
  phone: string
  email: string
  address: string
  city: string
  country: string
}

interface RestaurantState {
  // Data
  restaurant: Restaurant | null
  categories: Category[]
  menuItems: MenuItem[]

  // UI State
  isLoading: boolean
  error: string | null
  lastUpdated: string | null

  // Real-time connection
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"

  // Actions
  setRestaurant: (restaurant: Restaurant) => void
  setCategories: (categories: Category[]) => void
  setMenuItems: (items: MenuItem[]) => void

  // Optimistic updates
  addMenuItem: (item: Omit<MenuItem, "id" | "created_at" | "updated_at">) => Promise<MenuItem>
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<MenuItem>
  deleteMenuItem: (id: string) => Promise<void>

  addCategory: (category: Omit<Category, "id" | "items">) => Promise<Category>
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>

  // Real-time methods
  connect: () => void
  disconnect: () => void

  // Utility methods
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

// Mock WebSocket for real-time updates
class MockWebSocket {
  private callbacks: { [key: string]: Function[] } = {}
  private connected = false

  connect() {
    setTimeout(() => {
      this.connected = true
      this.emit("connect")
    }, 1000)
  }

  disconnect() {
    this.connected = false
    this.emit("disconnect")
  }

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  emit(event: string, data?: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback(data))
    }
  }

  // Simulate real-time updates
  simulateUpdate(type: "menu_item" | "category", action: "create" | "update" | "delete", data: any) {
    if (this.connected) {
      this.emit("update", { type, action, data })
    }
  }
}

const mockWebSocket = new MockWebSocket()

export const useRestaurantStore = create<RestaurantState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      restaurant: null,
      categories: [],
      menuItems: [],
      isLoading: false,
      error: null,
      lastUpdated: null,
      isConnected: false,
      connectionStatus: "disconnected",

      // Basic setters
      setRestaurant: (restaurant) => set({ restaurant }),
      setCategories: (categories) => set({ categories }),
      setMenuItems: (menuItems) => set({ menuItems }),

      // Optimistic menu item operations
      addMenuItem: async (itemData) => {
        const tempId = `temp-${Date.now()}`
        const tempItem: MenuItem = {
          ...itemData,
          id: tempId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Optimistic update
        set((state) => {
          state.menuItems.push(tempItem)
          // Add to category
          const category = state.categories.find((c) => c.id === itemData.category_id)
          if (category) {
            category.items.push(tempItem)
          }
        })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))
          const realId = `item-${Date.now()}`
          const realItem = { ...tempItem, id: realId }

          // Replace temp item with real item
          set((state) => {
            const itemIndex = state.menuItems.findIndex((item) => item.id === tempId)
            if (itemIndex !== -1) {
              state.menuItems[itemIndex] = realItem
            }

            // Update in category
            const category = state.categories.find((c) => c.id === itemData.category_id)
            if (category) {
              const categoryItemIndex = category.items.findIndex((item) => item.id === tempId)
              if (categoryItemIndex !== -1) {
                category.items[categoryItemIndex] = realItem
              }
            }

            state.lastUpdated = new Date().toISOString()
          })

          // Simulate real-time update to other clients
          mockWebSocket.simulateUpdate("menu_item", "create", realItem)

          return realItem
        } catch (error) {
          // Revert optimistic update on error
          set((state) => {
            state.menuItems = state.menuItems.filter((item) => item.id !== tempId)
            const category = state.categories.find((c) => c.id === itemData.category_id)
            if (category) {
              category.items = category.items.filter((item) => item.id !== tempId)
            }
            state.error = "Failed to add menu item"
          })
          throw error
        }
      },

      updateMenuItem: async (id, updates) => {
        const originalItem = get().menuItems.find((item) => item.id === id)
        if (!originalItem) throw new Error("Item not found")

        const updatedItem = { ...originalItem, ...updates, updated_at: new Date().toISOString() }

        // Optimistic update
        set((state) => {
          const itemIndex = state.menuItems.findIndex((item) => item.id === id)
          if (itemIndex !== -1) {
            state.menuItems[itemIndex] = updatedItem
          }

          // Update in category
          const category = state.categories.find((c) => c.items.some((item) => item.id === id))
          if (category) {
            const categoryItemIndex = category.items.findIndex((item) => item.id === id)
            if (categoryItemIndex !== -1) {
              category.items[categoryItemIndex] = updatedItem
            }
          }
        })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 300))

          set((state) => {
            state.lastUpdated = new Date().toISOString()
          })

          // Simulate real-time update
          mockWebSocket.simulateUpdate("menu_item", "update", updatedItem)

          return updatedItem
        } catch (error) {
          // Revert on error
          set((state) => {
            const itemIndex = state.menuItems.findIndex((item) => item.id === id)
            if (itemIndex !== -1) {
              state.menuItems[itemIndex] = originalItem
            }

            const category = state.categories.find((c) => c.items.some((item) => item.id === id))
            if (category) {
              const categoryItemIndex = category.items.findIndex((item) => item.id === id)
              if (categoryItemIndex !== -1) {
                category.items[categoryItemIndex] = originalItem
              }
            }

            state.error = "Failed to update menu item"
          })
          throw error
        }
      },

      deleteMenuItem: async (id) => {
        const originalItem = get().menuItems.find((item) => item.id === id)
        if (!originalItem) return

        // Optimistic update
        set((state) => {
          state.menuItems = state.menuItems.filter((item) => item.id !== id)

          // Remove from category
          const category = state.categories.find((c) => c.items.some((item) => item.id === id))
          if (category) {
            category.items = category.items.filter((item) => item.id !== id)
          }
        })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 300))

          set((state) => {
            state.lastUpdated = new Date().toISOString()
          })

          // Simulate real-time update
          mockWebSocket.simulateUpdate("menu_item", "delete", { id })
        } catch (error) {
          // Revert on error
          set((state) => {
            state.menuItems.push(originalItem)

            const category = state.categories.find((c) => c.id === originalItem.category_id)
            if (category) {
              category.items.push(originalItem)
            }

            state.error = "Failed to delete menu item"
          })
          throw error
        }
      },

      // Category operations
      addCategory: async (categoryData) => {
        const tempId = `temp-cat-${Date.now()}`
        const tempCategory: Category = {
          ...categoryData,
          id: tempId,
          items: [],
        }

        // Optimistic update
        set((state) => {
          state.categories.push(tempCategory)
        })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const realId = `cat-${Date.now()}`
          const realCategory = { ...tempCategory, id: realId }

          set((state) => {
            const categoryIndex = state.categories.findIndex((cat) => cat.id === tempId)
            if (categoryIndex !== -1) {
              state.categories[categoryIndex] = realCategory
            }
            state.lastUpdated = new Date().toISOString()
          })

          mockWebSocket.simulateUpdate("category", "create", realCategory)
          return realCategory
        } catch (error) {
          set((state) => {
            state.categories = state.categories.filter((cat) => cat.id !== tempId)
            state.error = "Failed to add category"
          })
          throw error
        }
      },

      updateCategory: async (id, updates) => {
        const originalCategory = get().categories.find((cat) => cat.id === id)
        if (!originalCategory) throw new Error("Category not found")

        const updatedCategory = { ...originalCategory, ...updates }

        set((state) => {
          const categoryIndex = state.categories.findIndex((cat) => cat.id === id)
          if (categoryIndex !== -1) {
            state.categories[categoryIndex] = updatedCategory
          }
        })

        try {
          await new Promise((resolve) => setTimeout(resolve, 300))
          set((state) => {
            state.lastUpdated = new Date().toISOString()
          })

          mockWebSocket.simulateUpdate("category", "update", updatedCategory)
          return updatedCategory
        } catch (error) {
          set((state) => {
            const categoryIndex = state.categories.findIndex((cat) => cat.id === id)
            if (categoryIndex !== -1) {
              state.categories[categoryIndex] = originalCategory
            }
            state.error = "Failed to update category"
          })
          throw error
        }
      },

      deleteCategory: async (id) => {
        const originalCategory = get().categories.find((cat) => cat.id === id)
        if (!originalCategory) return

        set((state) => {
          state.categories = state.categories.filter((cat) => cat.id !== id)
          // Remove items from this category
          state.menuItems = state.menuItems.filter((item) => item.category_id !== id)
        })

        try {
          await new Promise((resolve) => setTimeout(resolve, 300))
          set((state) => {
            state.lastUpdated = new Date().toISOString()
          })

          mockWebSocket.simulateUpdate("category", "delete", { id })
        } catch (error) {
          set((state) => {
            state.categories.push(originalCategory)
            // Restore items
            originalCategory.items.forEach((item) => {
              if (!state.menuItems.find((existing) => existing.id === item.id)) {
                state.menuItems.push(item)
              }
            })
            state.error = "Failed to delete category"
          })
          throw error
        }
      },

      // Real-time connection
      connect: () => {
        set({ connectionStatus: "connecting" })
        mockWebSocket.connect()

        mockWebSocket.on("connect", () => {
          set({ isConnected: true, connectionStatus: "connected" })
        })

        mockWebSocket.on("disconnect", () => {
          set({ isConnected: false, connectionStatus: "disconnected" })
        })

        mockWebSocket.on("update", (update) => {
          // Handle real-time updates from other clients
          console.log("[v0] Real-time update received:", update)

          if (update.type === "menu_item") {
            if (update.action === "create") {
              set((state) => {
                if (!state.menuItems.find((item) => item.id === update.data.id)) {
                  state.menuItems.push(update.data)

                  const category = state.categories.find((c) => c.id === update.data.category_id)
                  if (category && !category.items.find((item) => item.id === update.data.id)) {
                    category.items.push(update.data)
                  }
                }
              })
            } else if (update.action === "update") {
              set((state) => {
                const itemIndex = state.menuItems.findIndex((item) => item.id === update.data.id)
                if (itemIndex !== -1) {
                  state.menuItems[itemIndex] = update.data
                }

                const category = state.categories.find((c) => c.items.some((item) => item.id === update.data.id))
                if (category) {
                  const categoryItemIndex = category.items.findIndex((item) => item.id === update.data.id)
                  if (categoryItemIndex !== -1) {
                    category.items[categoryItemIndex] = update.data
                  }
                }
              })
            } else if (update.action === "delete") {
              set((state) => {
                state.menuItems = state.menuItems.filter((item) => item.id !== update.data.id)

                state.categories.forEach((category) => {
                  category.items = category.items.filter((item) => item.id !== update.data.id)
                })
              })
            }
          }
        })
      },

      disconnect: () => {
        mockWebSocket.disconnect()
      },

      // Utility methods
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    })),
  ),
)

// Initialize with mock data
export const initializeMockData = () => {
  const store = useRestaurantStore.getState()

  const mockRestaurant: Restaurant = {
    id: "rest-1",
    name: "Tablesalt Demo Restaurant",
    description: "AI-powered restaurant management demo",
    cuisine_type: "International",
    phone: "+1234567890",
    email: "demo@tablesalt.ai",
    address: "123 Demo Street",
    city: "San Francisco",
    country: "USA",
  }

  const mockCategories: Category[] = [
    {
      id: "cat-1",
      name: "Main Course",
      description: "Hearty main dishes",
      display_order: 1,
      is_active: true,
      items: [],
    },
    {
      id: "cat-2",
      name: "Appetizers",
      description: "Start your meal right",
      display_order: 0,
      is_active: true,
      items: [],
    },
    {
      id: "cat-3",
      name: "Desserts",
      description: "Sweet endings",
      display_order: 2,
      is_active: true,
      items: [],
    },
  ]

  const mockMenuItems: MenuItem[] = [
    {
      id: "item-1",
      name: "Butter Chicken Curry",
      description: "Creamy tomato-based curry with tender chicken pieces",
      price: 18.99,
      category_id: "cat-1",
      image_url: "/butter-chicken-curry.png",
      dietary_tags: ["Gluten-Free"],
      allergens: ["Dairy"],
      is_available: true,
      popularity_score: 95,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "item-2",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with parmesan and croutons",
      price: 12.99,
      category_id: "cat-2",
      image_url: "/caesar-salad.png",
      dietary_tags: ["Vegetarian"],
      allergens: ["Gluten", "Dairy"],
      is_available: true,
      popularity_score: 78,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "item-3",
      name: "Margherita Pizza",
      description: "Classic pizza with fresh mozzarella and basil",
      price: 16.99,
      category_id: "cat-1",
      image_url: "/margherita-pizza.png",
      dietary_tags: ["Vegetarian"],
      allergens: ["Gluten", "Dairy"],
      is_available: true,
      popularity_score: 88,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "item-4",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      price: 8.99,
      category_id: "cat-3",
      dietary_tags: ["Vegetarian"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      is_available: true,
      popularity_score: 92,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
  ]

  // Assign items to categories
  mockCategories.forEach((category) => {
    category.items = mockMenuItems.filter((item) => item.category_id === category.id)
  })

  store.setRestaurant(mockRestaurant)
  store.setCategories(mockCategories)
  store.setMenuItems(mockMenuItems)
  store.connect()
}

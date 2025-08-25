import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { produce } from "immer"

// Types
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

export interface MenuState {
  // Data
  items: MenuItem[]
  categories: MenuCategory[]
  combos: MenuCombo[]

  // UI State
  selectedItems: string[]
  selectedCategory: string | null
  searchQuery: string
  viewMode: "grid" | "list"
  sortBy: "name" | "price" | "category" | "created"
  sortOrder: "asc" | "desc"

  // Loading states
  isLoading: boolean
  isSaving: boolean

  // History for undo/redo
  history: {
    items: MenuItem[]
    categories: MenuCategory[]
    combos: MenuCombo[]
  }[]
  historyIndex: number

  // Actions
  setItems: (items: MenuItem[]) => void
  setCategories: (categories: MenuCategory[]) => void
  setCombos: (combos: MenuCombo[]) => void

  // Item actions
  addItem: (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => void
  updateItem: (id: string, updates: Partial<MenuItem>) => void
  deleteItem: (id: string) => void
  toggleItemAvailability: (id: string) => void
  bulkUpdateItems: (ids: string[], updates: Partial<MenuItem>) => void

  // Category actions
  addCategory: (category: Omit<MenuCategory, "id" | "createdAt" | "updatedAt" | "itemCount">) => void
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void
  deleteCategory: (id: string) => void
  reorderCategories: (categoryIds: string[]) => void

  // Combo actions
  addCombo: (combo: Omit<MenuCombo, "id" | "createdAt" | "updatedAt">) => void
  updateCombo: (id: string, updates: Partial<MenuCombo>) => void
  deleteCombo: (id: string) => void
  toggleComboActive: (id: string) => void

  // Selection actions
  selectItem: (id: string) => void
  selectItems: (ids: string[]) => void
  deselectItem: (id: string) => void
  deselectAllItems: () => void
  toggleItemSelection: (id: string) => void

  // Filter and search actions
  setSelectedCategory: (categoryId: string | null) => void
  setSearchQuery: (query: string) => void
  setViewMode: (mode: "grid" | "list") => void
  setSortBy: (sortBy: "name" | "price" | "category" | "created") => void
  setSortOrder: (order: "asc" | "desc") => void

  // Loading actions
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void

  // History actions
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Computed selectors
  getFilteredItems: () => MenuItem[]
  getItemsByCategory: (categoryId: string) => MenuItem[]
  getCategoryById: (id: string) => MenuCategory | undefined
  getItemById: (id: string) => MenuItem | undefined
  getComboById: (id: string) => MenuCombo | undefined
  getSelectedItemsData: () => MenuItem[]
  getTotalItems: () => number
  getTotalCategories: () => number
  getAvailableItems: () => MenuItem[]
  getFeaturedItems: () => MenuItem[]
  getMenuStats: () => {
    totalItems: number
    availableItems: number
    featuredItems: number
    totalCategories: number
    averagePrice: number
    priceRange: { min: number; max: number }
  }
}

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Create the store (using immer's produce helper instead of zustand's immer middleware)
export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => {
      const setImmer = (updater: (state: MenuState) => void) => set(produce(updater))

      return {
        // Initial state
        items: [],
        categories: [],
        combos: [],
        selectedItems: [],
        selectedCategory: null,
        searchQuery: "",
        viewMode: "grid",
        sortBy: "name",
        sortOrder: "asc",
        isLoading: false,
        isSaving: false,
        history: [],
        historyIndex: -1,

        // Data setters
        setItems: (items) =>
          setImmer((state) => {
            state.items = items
          }),
        setCategories: (categories) =>
          setImmer((state) => {
            state.categories = categories
          }),
        setCombos: (combos) =>
          setImmer((state) => {
            state.combos = combos
          }),

        // Item actions
        addItem: (itemData) =>
          setImmer((state) => {
            const newItem: MenuItem = {
              ...itemData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            state.items.push(newItem)

            if (itemData.categoryId) {
              const category = state.categories.find((c) => c.id === itemData.categoryId)
              if (category) category.itemCount += 1
            }
          }),

        updateItem: (id, updates) =>
          setImmer((state) => {
            const itemIndex = state.items.findIndex((item) => item.id === id)
            if (itemIndex !== -1) {
              const oldCategoryId = state.items[itemIndex].categoryId
              state.items[itemIndex] = {
                ...state.items[itemIndex],
                ...updates,
                updatedAt: new Date().toISOString(),
              }

              if (updates.categoryId && updates.categoryId !== oldCategoryId) {
                if (oldCategoryId) {
                  const oldCategory = state.categories.find((c) => c.id === oldCategoryId)
                  if (oldCategory) oldCategory.itemCount -= 1
                }

                const newCategory = state.categories.find((c) => c.id === updates.categoryId)
                if (newCategory) newCategory.itemCount += 1
              }
            }
          }),

        deleteItem: (id) =>
          setImmer((state) => {
            const itemIndex = state.items.findIndex((item) => item.id === id)
            if (itemIndex !== -1) {
              const item = state.items[itemIndex]
              state.items.splice(itemIndex, 1)

              if (item.categoryId) {
                const category = state.categories.find((c) => c.id === item.categoryId)
                if (category) category.itemCount -= 1
              }

              const selectionIndex = state.selectedItems.indexOf(id)
              if (selectionIndex !== -1) state.selectedItems.splice(selectionIndex, 1)
            }
          }),

        toggleItemAvailability: (id) =>
          setImmer((state) => {
            const item = state.items.find((i) => i.id === id)
            if (item) {
              item.isAvailable = !item.isAvailable
              item.updatedAt = new Date().toISOString()
            }
          }),

        bulkUpdateItems: (ids, updates) =>
          setImmer((state) => {
            ids.forEach((id) => {
              const item = state.items.find((i) => i.id === id)
              if (item) Object.assign(item, updates, { updatedAt: new Date().toISOString() })
            })
          }),

        // Category actions
        addCategory: (categoryData) =>
          setImmer((state) => {
            const newCategory: MenuCategory = {
              ...categoryData,
              id: generateId(),
              itemCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            state.categories.push(newCategory)
          }),

        updateCategory: (id, updates) =>
          setImmer((state) => {
            const category = state.categories.find((cat) => cat.id === id)
            if (category) Object.assign(category, updates, { updatedAt: new Date().toISOString() })
          }),

        deleteCategory: (id) =>
          setImmer((state) => {
            const categoryIndex = state.categories.findIndex((cat) => cat.id === id)
            if (categoryIndex !== -1) {
              state.categories.splice(categoryIndex, 1)

              state.items.forEach((item) => {
                if (item.categoryId === id) item.categoryId = undefined
              })

              if (state.selectedCategory === id) state.selectedCategory = null
            }
          }),

        reorderCategories: (categoryIds) =>
          setImmer((state) => {
            categoryIds.forEach((id, index) => {
              const category = state.categories.find((cat) => cat.id === id)
              if (category) category.sortOrder = index
            })
            state.categories.sort((a, b) => a.sortOrder - b.sortOrder)
          }),

        // Combo actions
        addCombo: (comboData) =>
          setImmer((state) => {
            const newCombo: MenuCombo = {
              ...comboData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            state.combos.push(newCombo)
          }),

        updateCombo: (id, updates) =>
          setImmer((state) => {
            const combo = state.combos.find((c) => c.id === id)
            if (combo) Object.assign(combo, updates, { updatedAt: new Date().toISOString() })
          }),

        deleteCombo: (id) =>
          setImmer((state) => {
            const idx = state.combos.findIndex((c) => c.id === id)
            if (idx !== -1) state.combos.splice(idx, 1)
          }),

        toggleComboActive: (id) =>
          setImmer((state) => {
            const combo = state.combos.find((c) => c.id === id)
            if (combo) {
              combo.isActive = !combo.isActive
              combo.updatedAt = new Date().toISOString()
            }
          }),

        // Selection actions
        selectItem: (id) =>
          setImmer((state) => {
            if (!state.selectedItems.includes(id)) state.selectedItems.push(id)
          }),

        selectItems: (ids) =>
          setImmer((state) => {
            state.selectedItems = [...new Set([...state.selectedItems, ...ids])]
          }),

        deselectItem: (id) =>
          setImmer((state) => {
            const index = state.selectedItems.indexOf(id)
            if (index !== -1) state.selectedItems.splice(index, 1)
          }),

        deselectAllItems: () =>
          setImmer((state) => {
            state.selectedItems = []
          }),

        toggleItemSelection: (id) =>
          setImmer((state) => {
            const index = state.selectedItems.indexOf(id)
            if (index !== -1) state.selectedItems.splice(index, 1)
            else state.selectedItems.push(id)
          }),

        // Filter and search actions
        setSelectedCategory: (categoryId) =>
          setImmer((state) => {
            state.selectedCategory = categoryId
          }),
        setSearchQuery: (query) =>
          setImmer((state) => {
            state.searchQuery = query
          }),
        setViewMode: (mode) =>
          setImmer((state) => {
            state.viewMode = mode
          }),
        setSortBy: (sortBy) =>
          setImmer((state) => {
            state.sortBy = sortBy
          }),
        setSortOrder: (order) =>
          setImmer((state) => {
            state.sortOrder = order
          }),

        // Loading actions
        setLoading: (loading) =>
          setImmer((state) => {
            state.isLoading = loading
          }),
        setSaving: (saving) =>
          setImmer((state) => {
            state.isSaving = saving
          }),

        // History actions
        saveToHistory: () =>
          setImmer((state) => {
            const snapshot = {
              items: JSON.parse(JSON.stringify(state.items)),
              categories: JSON.parse(JSON.stringify(state.categories)),
              combos: JSON.parse(JSON.stringify(state.combos)),
            }

            state.history = state.history.slice(0, state.historyIndex + 1)
            state.history.push(snapshot)
            state.historyIndex = state.history.length - 1

            if (state.history.length > 50) {
              state.history.shift()
              state.historyIndex -= 1
            }
          }),

        undo: () =>
          setImmer((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex -= 1
              const snapshot = state.history[state.historyIndex]
              state.items = JSON.parse(JSON.stringify(snapshot.items))
              state.categories = JSON.parse(JSON.stringify(snapshot.categories))
              state.combos = JSON.parse(JSON.stringify(snapshot.combos))
            }
          }),

        redo: () =>
          setImmer((state) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex += 1
              const snapshot = state.history[state.historyIndex]
              state.items = JSON.parse(JSON.stringify(snapshot.items))
              state.categories = JSON.parse(JSON.stringify(snapshot.categories))
              state.combos = JSON.parse(JSON.stringify(snapshot.combos))
            }
          }),

        canUndo: () => {
          const state = get()
          return state.historyIndex > 0
        },

        canRedo: () => {
          const state = get()
          return state.historyIndex < state.history.length - 1
        },

        // Computed selectors
        getFilteredItems: () => {
          const state = get()
          let filtered = [...state.items]

          if (state.selectedCategory) {
            filtered = filtered.filter((item) => item.categoryId === state.selectedCategory)
          }

          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase()
            filtered = filtered.filter(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query) ||
                item.dietaryTags?.some((tag) => tag.toLowerCase().includes(query)),
            )
          }

          filtered.sort((a, b) => {
            let aValue: any, bValue: any

            switch (state.sortBy) {
              case "name":
                aValue = a.name.toLowerCase()
                bValue = b.name.toLowerCase()
                break
              case "price":
                aValue = a.price
                bValue = b.price
                break
              case "category":
                const aCat = state.categories.find((c) => c.id === a.categoryId)
                const bCat = state.categories.find((c) => c.id === b.categoryId)
                aValue = aCat?.name.toLowerCase() || ""
                bValue = bCat?.name.toLowerCase() || ""
                break
              case "created":
                aValue = new Date(a.createdAt).getTime()
                bValue = new Date(b.createdAt).getTime()
                break
              default:
                return 0
            }

            if (aValue < bValue) return state.sortOrder === "asc" ? -1 : 1
            if (aValue > bValue) return state.sortOrder === "asc" ? 1 : -1
            return 0
          })

          return filtered
        },

        getItemsByCategory: (categoryId) => {
          const state = get()
          return state.items.filter((item) => item.categoryId === categoryId)
        },

        getCategoryById: (id) => {
          const state = get()
          return state.categories.find((category) => category.id === id)
        },

        getItemById: (id) => {
          const state = get()
          return state.items.find((item) => item.id === id)
        },

        getComboById: (id) => {
          const state = get()
          return state.combos.find((combo) => combo.id === id)
        },

        getSelectedItemsData: () => {
          const state = get()
          return state.items.filter((item) => state.selectedItems.includes(item.id))
        },

        getTotalItems: () => {
          const state = get()
          return state.items.length
        },

        getTotalCategories: () => {
          const state = get()
          return state.categories.length
        },

        getAvailableItems: () => {
          const state = get()
          return state.items.filter((item) => item.isAvailable)
        },

        getFeaturedItems: () => {
          const state = get()
          return state.items.filter((item) => item.isFeatured)
        },

        getMenuStats: () => {
          const state = get()
          const availableItems = state.items.filter((item) => item.isAvailable)
          const featuredItems = state.items.filter((item) => item.isFeatured)
          const prices = state.items.map((item) => item.price).filter((price) => price > 0)

          return {
            totalItems: state.items.length,
            availableItems: availableItems.length,
            featuredItems: featuredItems.length,
            totalCategories: state.categories.length,
            averagePrice: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0,
            priceRange: {
              min: prices.length > 0 ? Math.min(...prices) : 0,
              max: prices.length > 0 ? Math.max(...prices) : 0,
            },
          }
        },
      }
    },
    {
      name: "menu-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        categories: state.categories,
        combos: state.combos,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    },
  ),
)

// Selectors for better performance
export const useMenuItems = () => useMenuStore((state) => state.items)
export const useMenuCategories = () => useMenuStore((state) => state.categories)
export const useMenuCombos = () => useMenuStore((state) => state.combos)
export const useSelectedItems = () => useMenuStore((state) => state.selectedItems)
export const useMenuFilters = () =>
  useMenuStore((state) => ({
    selectedCategory: state.selectedCategory,
    searchQuery: state.searchQuery,
    viewMode: state.viewMode,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }))
export const useMenuStats = () => useMenuStore((state) => state.getMenuStats())
export const useFilteredItems = () => useMenuStore((state) => state.getFilteredItems())

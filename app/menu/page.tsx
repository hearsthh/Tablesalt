"use client"

import { CardTitle } from "@/components/ui/card"

import { useEffect, useMemo, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  BarChart3,
  ArrowUp,
  Clock,
  Upload,
  Eye,
  Copy,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Monitor,
  FileText,
  CheckCircle,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Leaf,
  Wheat,
  AlertTriangle,
  Palette,
  Type,
  Tag,
  Shuffle,
  Calendar,
  Percent,
  Target,
  X,
  RotateCcw,
  ImageIcon,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"
import { MenuBulkActions } from "@/components/menu-bulk-actions"
import { ItemDetailsSheet } from "@/components/item-details-sheet"
import { useToast } from "@/components/ui/use-toast"
import { AIMenuEnhancementDialog } from "@/components/ai-menu-enhancement-dialog"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"

interface MenuItemVariant {
  id: string
  name: string
  price: number
  isDefault: boolean
}

interface MenuItemModifier {
  id: string
  name: string
  price: number
  category: string
  required: boolean
  maxSelections: number
}

interface NutritionalInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  isOutOfStock: boolean
  popularity: "high" | "medium" | "low" | number
  profitability: "high" | "medium" | "low"
  orders: number
  revenue: number
  rating: number
  trend: "up" | "down" | "stable"
  trendValue: number
  revenueChange: number
  variants: MenuItemVariant[]
  modifiers: MenuItemModifier[]
  nutritionalInfo: NutritionalInfo
  allergens: string[]
  dietaryTags: string[]
  preparationTime?: number
  spiceLevel?: number
  costPrice?: number
  sortOrder: number
  isCombo?: boolean
  status?: "active" | "inactive"
  lastOrdered?: string
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
  sortOrder: number
}

interface ComboItem {
  id: string
  name: string
  items: string[]
  itemIds: string[]
  price: number
  savings: number
  description: string
  category: string
  isActive: boolean
}

interface Integration {
  id: string
  name: string
  type: "listing" | "social" | "website"
  icon: any
  connected: boolean
  enabled: boolean
}

interface AIEnhancement {
  id: string
  type:
    | "menu_design"
    | "item_tags"
    | "item_descriptions"
    | "combos"
    | "price_optimization"
    | "menu_reordering"
    | "seasonal"
    | "item_cards"
    | "smart_offers"
  title: string
  description: string
  icon: any
  requiresSelection: boolean
  selectionType?: "items" | "categories" | "none"
  changes?: any[]
  applied?: boolean
  path?: string
}

interface AIInsight {
  type: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  revenue_impact: string
  action: string
  status: string
  actionHandler?: () => void
  navigationTarget?: {
    type: "item" | "category" | "page" | "combo"
    id?: string
    path?: string
  }
}

const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    price: 18.99,
    category: "Main Course",
    description: "Tender chicken in rich, creamy tomato sauce",
    image: "/butter-chicken.png",
    status: "active",
    popularity: 95,
    lastOrdered: "2 hours ago",
    isOutOfStock: false,
    profitability: "high",
    orders: 156,
    revenue: 2962.44,
    rating: 4.7,
    trend: "up",
    trendValue: 12,
    revenueChange: 15.2,
    sortOrder: 1,
    variants: [],
    modifiers: [],
    nutritionalInfo: {},
    allergens: [],
    dietaryTags: [],
  },
  {
    id: "2",
    name: "Mushroom Risotto",
    price: 19.99,
    category: "Main Course",
    description: "Creamy arborio rice with wild mushrooms",
    image: "/mushroom-risotto.png",
    status: "active",
    popularity: 87,
    lastOrdered: "1 hour ago",
    isOutOfStock: false,
    profitability: "medium",
    orders: 67,
    revenue: 1339.33,
    rating: 4.5,
    trend: "stable",
    trendValue: 0,
    revenueChange: 2.1,
    sortOrder: 2,
    variants: [],
    modifiers: [],
    nutritionalInfo: {},
    allergens: [],
    dietaryTags: [],
  },
  {
    id: "3",
    name: "Margherita Pizza",
    price: 16.5,
    category: "Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil",
    image: "/margherita-pizza.png",
    status: "active",
    popularity: 92,
    lastOrdered: "30 minutes ago",
    isOutOfStock: false,
    profitability: "high",
    orders: 203,
    revenue: 3349.5,
    rating: 4.8,
    trend: "up",
    trendValue: 18,
    revenueChange: 22.3,
    sortOrder: 1,
    variants: [],
    modifiers: [],
    nutritionalInfo: {},
    allergens: [],
    dietaryTags: [],
  },
  {
    id: "4",
    name: "Caesar Salad",
    price: 12.99,
    category: "Salads",
    description: "Crisp romaine lettuce with parmesan and croutons",
    image: "/caesar-salad.png",
    status: "active",
    popularity: 78,
    lastOrdered: "45 minutes ago",
    isOutOfStock: false,
    profitability: "high",
    orders: 89,
    revenue: 1156.11,
    rating: 4.3,
    trend: "down",
    trendValue: -5,
    revenueChange: -3.2,
    sortOrder: 1,
    variants: [],
    modifiers: [],
    nutritionalInfo: {},
    allergens: [],
    dietaryTags: [],
  },
]

export default function MenuPage() {
  const router = useRouter()
  const { toast } = useToast()

  // State declarations
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [restaurantId, setRestaurantId] = useState<string>("1") // Default restaurant
  const [restaurantName, setRestaurantName] = useState<string>("")

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading menu data from enhanced API client...")

      const [restaurantResponse, categoriesResponse, menuItemsResponse] = await Promise.all([
        enhancedApiClient.getRestaurant(restaurantId),
        enhancedApiClient.getCategories(restaurantId),
        enhancedApiClient.getMenuItems(restaurantId),
      ])

      if (restaurantResponse.success && categoriesResponse.success && menuItemsResponse.success) {
        const restaurant = restaurantResponse.data
        const categoriesData = categoriesResponse.data
        const menuItems = menuItemsResponse.data

        console.log("[v0] Loaded restaurant:", restaurant)
        console.log("[v0] Loaded categories:", categoriesData)
        console.log("[v0] Loaded menu items:", menuItems)

        const categoriesWithItems = categoriesData.map((category) => ({
          ...category,
          items: menuItems
            .filter((item) => item.category_id === category.id)
            .map((item) => ({
              ...item,
              category: category.name,
              orders: Math.floor(Math.random() * 100) + 10, // Mock order count
              revenue: item.price * (Math.floor(Math.random() * 100) + 10), // Mock revenue
              tags: item.dietary_tags || [],
              allergens: item.allergens || [],
              spiceLevel: item.spice_level || 0,
              preparationTime: item.preparation_time || 15,
              nutrition: {
                calories: item.calories || 0,
                protein: item.protein || 0,
                carbs: item.carbs || 0,
                fat: item.fat || 0,
                fiber: item.fiber || 0,
              },
              variants: item.variants || {},
              isAvailable: item.is_available !== false,
              popularityScore: item.popularity_score || 0,
            })),
        }))

        setCategories(categoriesWithItems)
        setRestaurantName(restaurant.name)

        toast({
          title: "Menu Data Loaded",
          description: `Loaded ${menuItems.length} items from ${restaurant.name}`,
        })
      } else {
        throw new Error("Failed to load menu data from API")
      }
    } catch (error) {
      console.error("[v0] Failed to load menu data:", error)
      toast({
        title: "Loading Error",
        description: "Using offline data. Some features may be limited.",
        variant: "destructive",
      })

      const raw = localStorage.getItem("currentMenuData")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed)
        }
      } else {
        // Default fallback categories
        setCategories([
          {
            id: "default-1",
            name: "Main Course",
            items: [],
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  // All other state declarations
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("menu")
  const [isPublished, setIsPublished] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [hasMenu, setHasMenu] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showPushDrawer, setShowPushDrawer] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false)
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false)
  const [addType, setAddType] = useState<"item" | "category">("item")
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [menuLink, setMenuLink] = useState("")
  const [sessionChanges, setSessionChanges] = useState<any[]>([])
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<MenuItem | null>(null)
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMenuStatusCollapsed, setIsMenuStatusCollapsed] = useState(false)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [showFloatingMenu, setShowFloatingMenu] = useState(false)
  const [showFiltersDialog, setShowFiltersDialog] = useState(false)
  const [showAIGenerationDialog, setShowAIGenerationDialog] = useState(false)
  const [aiGenerationStep, setAiGenerationStep] = useState(1)
  const [selectedAITool, setSelectedAITool] = useState<string>("")
  const [aiGenerationPrompt, setAiGenerationPrompt] = useState("")
  const [aiEnhancements, setAiEnhancements] = useState<AIEnhancement[]>([])
  const [aiGenerationLoading, setAiGenerationLoading] = useState(false)
  const [acceptedCombos, setAcceptedCombos] = useState<ComboItem[]>([])

  // Filters
  const [hideOutOfStock, setHideOutOfStock] = useState(false)
  const [popularityFilter, setPopularityFilter] = useState<string>("all")
  const [minRating, setMinRating] = useState<number>(0)

  // QR dialog state
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  // Pull to refresh
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const pullStartY = useRef(0)

  // Category refs for scrolling
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    dietaryTags: [],
    allergens: [],
    customTags: [],
    spiceLevel: 0,
    preparationTime: 0,
    costPrice: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    variants: [],
    modifiers: [],
  })

  const handleImageUpload = (result: any) => {
    if (result.success && result.url) {
      setNewItem((prev) => ({ ...prev, image: result.url }))
    }
  }

  const [newCategoryName, setNewCategoryName] = useState("")

  // Integration platforms
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "1", name: "Google My Business", type: "listing", icon: Monitor, connected: true, enabled: true },
    { id: "2", name: "Yelp", type: "listing", icon: Star, connected: true, enabled: false },
    { id: "3", name: "Zomato", type: "listing", icon: FileText, connected: false, enabled: false },
    { id: "4", name: "Instagram", type: "social", icon: Instagram, connected: true, enabled: true },
    { id: "5", name: "Facebook", type: "social", icon: Facebook, connected: true, enabled: true },
    { id: "6", name: "Website", type: "website", icon: Monitor, connected: true, enabled: true },
  ])

  const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
      const media = window.matchMedia(query)
      if (media.matches !== matches) {
        setMatches(media.matches)
      }
      const listener = () => setMatches(media.matches)
      media.addListener(listener)
      return () => media.removeListener(listener)
    }, [matches, query])

    return matches
  }

  // Check if mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // AI Tools Configuration - Updated with comprehensive options
  const aiTools: AIEnhancement[] = [
    {
      id: "smart_offers",
      type: "smart_offers",
      title: "Smart Promotional Offers",
      description: "AI-generated promotional offers and special deals based on customer behavior",
      icon: Percent,
      requiresSelection: false,
      selectionType: "none",
    },
    {
      id: "item_cards",
      type: "item_cards",
      title: "Enhanced Item Cards",
      description: "AI-powered item card improvements with better images, descriptions, and layout",
      icon: Type,
      requiresSelection: true,
      selectionType: "items",
    },
    {
      id: "item_tags",
      type: "item_tags",
      title: "Smart Item Tags",
      description: "Add dietary, allergen, and cuisine tags with intelligent categorization",
      icon: Tag,
      requiresSelection: true,
      selectionType: "items",
    },
    {
      id: "menu_reordering",
      type: "menu_reordering",
      title: "Menu Layout Optimization",
      description: "Optimize item and category order for maximum sales impact",
      icon: Shuffle,
      requiresSelection: true,
      selectionType: "categories",
    },
    {
      id: "menu_design",
      type: "menu_design",
      title: "Menu Design Studio",
      description: "Complete visual design overhaul with AI-powered templates, colors, and layouts",
      icon: Palette,
      requiresSelection: false,
      selectionType: "none",
      path: "/menu/ai/design",
    },
    {
      id: "seasonal_themes",
      type: "seasonal",
      title: "Seasonal Menu Themes",
      description: "Automatic seasonal themes and temporary menu layouts with AI recommendations",
      icon: Calendar,
      requiresSelection: false,
      selectionType: "none",
      path: "/menu/ai/seasonal",
    },
  ]

  // Move derived values after state declarations
  const allItems = useMemo(() => categories.flatMap((cat) => cat.items), [categories])
  const totalOrders = allItems.reduce((sum, item) => sum + item.orders, 0)
  const totalRevenue = allItems.reduce((sum, item) => sum + item.revenue, 0)
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const menuScore = 86

  const menuOverview = {
    score: menuScore,
    totalItems: allItems.length,
    aov: aov,
    totalOrders: totalOrders,
    scoreChange: 3.2,
    itemsChange: 2,
    aovChange: 4.1,
    ordersChange: 12.5,
  }

  // Load accepted combos from localStorage
  useEffect(() => {
    try {
      const savedCombos = localStorage.getItem("acceptedCombos")
      if (savedCombos) {
        const combos = JSON.parse(savedCombos)
        setAcceptedCombos(combos)
      }
    } catch (error) {
      console.error("Error loading combos:", error)
    }
  }, [])

  // Save menu data to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem("currentMenuData", JSON.stringify(categories))
  }, [categories])

  // Save accepted combos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("acceptedCombos", JSON.stringify(acceptedCombos))
  }, [acceptedCombos])

  // Open Add dialog if /menu?openAdd=1
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get("openAdd") === "1") {
        setShowAddDialog(true)
      }
    } catch {}
  }, [])

  const handleItemsUpdate = (updatedItems: MenuItem[]) => {
    const updatedCategories = [...categories]

    // Update existing items and add new ones
    updatedItems.forEach((updatedItem) => {
      let itemFound = false

      // First, try to update existing items
      updatedCategories.forEach((category) => {
        const itemIndex = category.items.findIndex((item) => item.id === updatedItem.id)
        if (itemIndex !== -1) {
          category.items[itemIndex] = updatedItem
          itemFound = true
        }
      })

      // If item not found and it's a combo, add to Combos category
      if (!itemFound && updatedItem.isCombo) {
        let combosCategory = updatedCategories.find((cat) => cat.name === "Combos")
        if (!combosCategory) {
          combosCategory = {
            id: "combos",
            name: "Combos",
            items: [],
            sortOrder: updatedCategories.length + 1,
          }
          updatedCategories.push(combosCategory)
        }
        combosCategory.items.push(updatedItem)
      }
    })

    setCategories(updatedCategories)
  }

  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
  }

  const handleAddItem = async (itemData: Partial<MenuItem>) => {
    try {
      const response = await enhancedApiClient.createMenuItem({
        ...itemData,
        restaurant_id: restaurantId,
        category_id: categories.find((cat) => cat.name === itemData.category)?.id,
      })

      if (response.success) {
        const newItem = {
          ...response.data,
          category: itemData.category,
          orders: 0,
          revenue: 0,
          tags: response.data.dietary_tags || [],
          allergens: response.data.allergens || [],
          spiceLevel: response.data.spice_level || 0,
          preparationTime: response.data.preparation_time || 15,
          nutrition: {
            calories: response.data.calories || 0,
            protein: response.data.protein || 0,
            carbs: response.data.carbs || 0,
            fat: response.data.fat || 0,
            fiber: response.data.fiber || 0,
          },
          variants: response.data.variants || {},
          isAvailable: response.data.is_available !== false,
          popularityScore: response.data.popularity_score || 0,
        }

        setCategories((prev) =>
          prev.map((cat) => (cat.name === itemData.category ? { ...cat, items: [...cat.items, newItem] } : cat)),
        )

        console.log("[v0] Created item via enhanced API:", newItem)
        toast({
          title: "Item Added",
          description: `${newItem.name} has been added to the menu`,
        })
      } else {
        throw new Error(response.error || "Failed to create item")
      }

      setShowAddDialog(false)
      setHasChanges(true)
    } catch (error) {
      console.error("Failed to add item:", error)
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async (itemData: Partial<MenuItem>) => {
    if (!editingItem) return

    try {
      const response = await enhancedApiClient.updateMenuItem(editingItem.id, {
        ...itemData,
        restaurant_id: restaurantId,
        category_id: categories.find((cat) => cat.name === itemData.category)?.id,
      })

      if (response.success) {
        const updatedItem = {
          ...response.data,
          category: itemData.category,
          orders: editingItem.orders,
          revenue: editingItem.revenue,
          tags: response.data.dietary_tags || [],
          allergens: response.data.allergens || [],
          spiceLevel: response.data.spice_level || 0,
          preparationTime: response.data.preparation_time || 15,
          nutrition: {
            calories: response.data.calories || 0,
            protein: response.data.protein || 0,
            carbs: response.data.carbs || 0,
            fat: response.data.fat || 0,
            fiber: response.data.fiber || 0,
          },
          variants: response.data.variants || {},
          isAvailable: response.data.is_available !== false,
          popularityScore: response.data.popularity_score || 0,
        }

        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => (item.id === editingItem.id ? updatedItem : item)),
          })),
        )

        console.log("[v0] Updated item via enhanced API:", updatedItem)
        toast({
          title: "Item Updated",
          description: `${updatedItem.name} has been updated`,
        })
      } else {
        throw new Error(response.error || "Failed to update item")
      }

      setEditingItem(null)
      setShowEditDialog(false)
      setHasChanges(true)
    } catch (error) {
      console.error("Failed to update item:", error)
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await enhancedApiClient.deleteMenuItem(itemId)

      if (response.success) {
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.filter((item) => item.id !== itemId),
          })),
        )

        console.log("[v0] Deleted item via enhanced API:", itemId)
        toast({
          title: "Item Deleted",
          description: "Menu item has been removed",
        })
      } else {
        throw new Error(response.error || "Failed to delete item")
      }

      setHasChanges(true)
    } catch (error) {
      console.error("Failed to delete item:", error)
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAIItemsUpdate = async (updatedItems: MenuItem[]) => {
    try {
      console.log("[v0] Applying AI updates to items:", updatedItems)

      // Update items via enhanced API client
      const updatePromises = updatedItems.map((item) =>
        enhancedApiClient.updateMenuItem(item.id, {
          name: item.name,
          description: item.description,
          price: item.price,
          dietary_tags: item.tags,
          allergens: item.allergens,
          spice_level: item.spiceLevel,
          preparation_time: item.preparationTime,
          calories: item.nutrition?.calories,
          protein: item.nutrition?.protein,
          carbs: item.nutrition?.carbs,
          fat: item.nutrition?.fat,
          fiber: item.nutrition?.fiber,
        }),
      )

      await Promise.all(updatePromises)

      // Update local state
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => {
            const updated = updatedItems.find((u) => u.id === item.id)
            return updated || item
          }),
        })),
      )

      setHasChanges(true)
      toast({
        title: "AI Updates Applied",
        description: `Updated ${updatedItems.length} menu items with AI suggestions`,
      })
    } catch (error) {
      console.error("Failed to update items via AI:", error)
      toast({
        title: "AI Update Error",
        description: "Failed to apply AI suggestions. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAICategoriesUpdate = async (updatedCategories: Category[]) => {
    try {
      // Update categories via API
      // const updatePromises = updatedCategories.map((cat) => ApiClient.updateCategory(cat.id, cat))
      // await Promise.all(updatePromises)

      setCategories(updatedCategories)
      setHasChanges(true)
    } catch (error) {
      console.error("Failed to update categories via AI:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <NavigationDrawer />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">Menu Intelligence</h1>
              <p className="text-xs text-gray-500 truncate">AI-powered menu optimization</p>
            </div>
          </div>
        </div>

        {/* Secondary Action Bar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {/* Left side - Action buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Button
              variant="outline"
              onClick={() => window.open("/menu/preview", "_blank")}
              size="sm"
              className="text-xs px-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex-shrink-0 h-7"
              disabled={!hasMenu}
            >
              <Eye className="h-3 w-3 mr-1 text-gray-600" />
              Preview
            </Button>

            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-7 flex-shrink-0"
                >
                  <Upload className="h-3 w-3 mr-1 text-gray-600" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Import Menu</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">Choose how you'd like to import your menu data:</div>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = ".csv,.xlsx,.json"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            toast({ title: "Menu uploaded successfully!", description: `Imported ${file.name}` })
                            setHasMenu(true)
                            setHasChanges(true)
                            setShowUploadDialog(false)
                          }
                        }
                        input.click()
                      }}
                      className="w-full justify-start bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2 text-gray-600" />
                      Upload File (CSV, Excel, JSON)
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {selectedItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 bg-blue-50 text-blue-700 border-blue-200 h-7 flex-shrink-0"
                onClick={() => setShowBulkActionsDialog(true)}
              >
                <MoreHorizontal className="h-3 w-3 mr-1" />
                {selectedItems.length}
              </Button>
            )}
          </div>

          {/* Right side - Add and AI buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {loading ? null : (
              <Dialog
                open={showAddDialog || showEditDialog}
                onOpenChange={(open) => {
                  if (!open) {
                    setShowAddDialog(false)
                    setShowEditDialog(false)
                    setEditingItem(null)
                    setNewItem({
                      name: "",
                      description: "",
                      price: 0,
                      category: "",
                      image: "",
                      dietaryTags: [],
                      allergens: [],
                      customTags: [],
                      spiceLevel: 0,
                      preparationTime: 0,
                      costPrice: 0,
                      calories: 0,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      fiber: 0,
                      variants: [],
                      modifiers: [],
                    })
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 h-7 px-3 text-xs rounded-md" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Image Upload Section */}
                    <div>
                      <Label>Item Image</Label>
                      <ImageUpload
                        onUpload={handleImageUpload}
                        currentImage={editingItem?.image || newItem.image}
                        folder="menu-items"
                      />
                    </div>

                    {!editingItem && (
                      <div className="flex space-x-2">
                        <Button
                          variant={addType === "item" ? "default" : "outline"}
                          onClick={() => setAddType("item")}
                          className="flex-1 h-8 text-xs"
                        >
                          Add Item
                        </Button>
                        <Button
                          variant={addType === "category" ? "default" : "outline"}
                          onClick={() => setAddType("category")}
                          className="flex-1 h-8 text-xs"
                        >
                          Add Category
                        </Button>
                      </div>
                    )}

                    {addType === "item" || editingItem ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-900">Item Name *</Label>
                            <Input
                              value={newItem.name || ""}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              placeholder="Enter item name"
                              className="mt-1 border-gray-300"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-900">Price *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newItem.price?.toString() || ""}
                              onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                              placeholder="0.00"
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-900">Description</Label>
                          <Textarea
                            value={newItem.description || ""}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Enter item description"
                            className="mt-1 min-h-[80px] resize-none border-gray-300"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-900">Category *</Label>
                          <Select
                            value={newItem.category}
                            onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                          >
                            <SelectTrigger className="mt-1 border-gray-300">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="new">+ New Category</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newItem.category === "new" && (
                          <div>
                            <Label className="text-sm font-medium text-gray-900">New Category Name</Label>
                            <Input
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Enter category name"
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-900">Preparation Time (min)</Label>
                            <Input
                              type="number"
                              value={newItem.preparationTime?.toString() || ""}
                              onChange={(e) =>
                                setNewItem({ ...newItem, preparationTime: Number.parseInt(e.target.value) })
                              }
                              placeholder="15"
                              className="mt-1 border-gray-300"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-900">Cost Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newItem.costPrice?.toString() || ""}
                              onChange={(e) => setNewItem({ ...newItem, costPrice: Number.parseFloat(e.target.value) })}
                              placeholder="0.00"
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-900">Spice Level (0-5)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            value={newItem.spiceLevel?.toString() || "0"}
                            onChange={(e) => setNewItem({ ...newItem, spiceLevel: Number.parseInt(e.target.value) })}
                            placeholder="0"
                            className="mt-1 border-gray-300"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-900">Allergens</Label>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            {["Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Fish", "Shellfish", "Sesame"].map(
                              (allergen) => (
                                <div key={allergen} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={newItem.allergens?.includes(allergen) || false}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setNewItem({
                                          ...newItem,
                                          allergens: [...(newItem.allergens || []), allergen],
                                        })
                                      } else {
                                        setNewItem({
                                          ...newItem,
                                          allergens: (newItem.allergens || []).filter((a) => a !== allergen),
                                        })
                                      }
                                    }}
                                  />
                                  <Label className="text-xs text-gray-900">{allergen}</Label>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-900">Dietary Tags</Label>
                          <div className="mt-1 space-y-2">
                            {/* Predefined tags */}
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                "Vegetarian",
                                "Vegan",
                                "Gluten-Free",
                                "Dairy-Free",
                                "Nut-Free",
                                "Spicy",
                                "Popular",
                                "Chef's Special",
                              ].map((tag) => (
                                <div key={tag} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={newItem.dietaryTags?.includes(tag) || false}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setNewItem({
                                          ...newItem,
                                          dietaryTags: [...(newItem.dietaryTags || []), tag],
                                        })
                                      } else {
                                        setNewItem({
                                          ...newItem,
                                          dietaryTags: (newItem.dietaryTags || []).filter((t) => t !== tag),
                                        })
                                      }
                                    }}
                                  />
                                  <Label className="text-xs text-gray-900">{tag}</Label>
                                </div>
                              ))}
                            </div>

                            {/* Custom tags input */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add custom tag..."
                                value={newItem.customTags || ""}
                                onChange={(e) => setNewItem({ ...newItem, customTags: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    const tag = newItem.customTags.trim()
                                    if (tag && !(newItem.dietaryTags || []).includes(tag)) {
                                      setNewItem({
                                        ...newItem,
                                        dietaryTags: [...(newItem.dietaryTags || []), tag],
                                        customTags: "",
                                      })
                                    }
                                  }
                                }}
                                className="flex-1 h-8 text-sm border-gray-300"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  const tag = newItem.customTags.trim()
                                  if (tag && !(newItem.dietaryTags || []).includes(tag)) {
                                    setNewItem({
                                      ...newItem,
                                      dietaryTags: [...(newItem.dietaryTags || []), tag],
                                      customTags: "",
                                    })
                                  }
                                }}
                                className="h-8 px-3"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Display selected tags */}
                            <div className="flex flex-wrap gap-1">
                              {(newItem.dietaryTags || []).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewItem({
                                        ...newItem,
                                        dietaryTags: (newItem.dietaryTags || []).filter((_, i) => i !== index),
                                      })
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-900">Category Name *</Label>
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="mt-1 border-gray-300"
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        if (editingItem) {
                          // Update item logic
                          if (!newItem.name || !newItem.price) {
                            toast({
                              title: "Please fill in required fields",
                              description: "Name and price are required",
                            })
                            return
                          }
                          const categoryName = newItem.category === "new" ? newCategoryName : newItem.category
                          if (!categoryName) {
                            toast({ title: "Please select a category", description: "Category is required" })
                            return
                          }

                          handleEditItem({
                            ...newItem,
                            name: newItem.name,
                            description: newItem.description,
                            price: newItem.price,
                            category: categoryName,
                            image: newItem.image,
                            preparationTime: newItem.preparationTime,
                            spiceLevel: newItem.spiceLevel,
                            costPrice: newItem.costPrice,
                            allergens: newItem.allergens,
                            dietaryTags: newItem.dietaryTags,
                          })

                          setNewItem({
                            name: "",
                            description: "",
                            price: 0,
                            category: "",
                            image: "",
                            dietaryTags: [],
                            allergens: [],
                            customTags: [],
                            spiceLevel: 0,
                            preparationTime: 0,
                            costPrice: 0,
                            calories: 0,
                            protein: 0,
                            carbs: 0,
                            fat: 0,
                            fiber: 0,
                            variants: [],
                            modifiers: [],
                          })
                          setEditingItem(null)
                          setShowEditDialog(false)
                          setHasChanges(true)
                          toast({ title: "Item updated successfully!" })
                        } else if (addType === "item") {
                          // Add item logic
                          if (!newItem.name || !newItem.price) {
                            toast({
                              title: "Please fill in required fields",
                              description: "Name and price are required",
                            })
                            return
                          }

                          const categoryName = newItem.category === "new" ? newCategoryName : newItem.category
                          if (!categoryName) {
                            toast({ title: "Please select a category", description: "Category is required" })
                            return
                          }

                          handleAddItem({
                            name: newItem.name,
                            description: newItem.description,
                            price: newItem.price,
                            category: categoryName,
                            image: newItem.image,
                            preparationTime: newItem.preparationTime,
                            spiceLevel: newItem.spiceLevel,
                            costPrice: newItem.costPrice,
                            allergens: newItem.allergens,
                            dietaryTags: newItem.dietaryTags,
                          })

                          setNewItem({
                            name: "",
                            description: "",
                            price: 0,
                            category: "",
                            image: "",
                            dietaryTags: [],
                            allergens: [],
                            customTags: [],
                            spiceLevel: 0,
                            preparationTime: 0,
                            costPrice: 0,
                            calories: 0,
                            protein: 0,
                            carbs: 0,
                            fat: 0,
                            fiber: 0,
                            variants: [],
                            modifiers: [],
                          })
                          setShowAddDialog(false)
                          setHasChanges(true)
                          setHasMenu(true)
                          toast({ title: "Item added successfully!" })
                        } else {
                          // Add category logic
                          if (!newCategoryName) {
                            toast({ title: "Please enter a category name" })
                            return
                          }
                          const newCategory: Category = {
                            id: Date.now().toString(),
                            name: newCategoryName,
                            items: [],
                            sortOrder: categories.length + 1,
                          }
                          setCategories((prev) => [...prev, newCategory])
                          setNewCategoryName("")
                          setShowAddDialog(false)
                          setHasChanges(true)
                          setHasMenu(true)
                          toast({ title: "Category added successfully!" })
                        }
                      }}
                      className="w-full bg-gray-900 text-white hover:bg-gray-800 h-9"
                      disabled={
                        addType === "item" || editingItem
                          ? !newItem.name || !newItem.price || (!newItem.category && !newCategoryName)
                          : !newCategoryName
                      }
                    >
                      {editingItem ? "Update Item" : addType === "item" ? "Add Item" : "Add Category"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button
              className="bg-gray-900 text-white hover:bg-gray-800 h-7 px-2 text-xs rounded-md"
              size="sm"
              disabled={!hasMenu}
              onClick={() => setShowAIGenerationDialog(true)}
            >
              <Zap className="h-3 w-3 text-blue-400" />
            </Button>
          </div>
        </div>
      </header>

      <AIMenuEnhancementDialog
        open={showAIGenerationDialog}
        onOpenChange={setShowAIGenerationDialog}
        type="combos"
        menuItems={allItems}
        onItemsUpdate={handleItemsUpdate}
        onCategoriesUpdate={handleCategoriesUpdate}
        categories={categories}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Menu Status Section - Collapsible */}
        <Collapsible open={!isMenuStatusCollapsed} onOpenChange={setIsMenuStatusCollapsed}>
          <div className="bg-white border border-gray-200 rounded-lg">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${isPublished && !hasChanges ? "bg-green-500" : hasMenu ? "bg-yellow-500" : "bg-gray-400"}`}
                ></div>
                <span className="text-sm font-medium text-gray-900">Menu Status</span>
                {!hasMenu && <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs">No Menu</Badge>}
                {hasMenu && !isPublished && (
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Draft</Badge>
                )}
                {isPublished && !hasChanges && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Live</Badge>
                )}
                {hasChanges && isPublished && (
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Changes Pending</Badge>
                )}
              </div>
              {isMenuStatusCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              )}
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => {
                      const link = `https://menu.tablesalt.ai/${Date.now()}`
                      setMenuLink(link)
                      setIsPublished(true)
                      setHasChanges(false)
                      toast({ title: "Menu published successfully!", description: "Your menu is now live!" })
                    }}
                    disabled={!hasMenu || (!hasChanges && isPublished)}
                    className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2 py-1 h-7"
                  >
                    {!isPublished ? "Publish Menu" : hasChanges ? "Publish Changes" : "Published"}
                    {isPublished && !hasChanges && <CheckCircle className="h-3 w-3 ml-1" />}
                  </Button>

                  {isPublished && (
                    <>
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (menuLink) {
                              navigator.clipboard.writeText(menuLink)
                              setShowCopyToast(true)
                              setTimeout(() => setShowCopyToast(false), 3000)
                            }
                          }}
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-2 py-1 h-7"
                        >
                          <Copy className="h-3 w-3 mr-1 text-gray-600" />
                          Copy Link
                        </Button>
                        {showCopyToast && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                            Link copied
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowShareDialog(true)}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-2 py-1 h-7"
                      >
                        <Share2 className="h-3 w-3 mr-1 text-gray-600" />
                        Share
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsPublished(false)
                          setMenuLink("")
                          toast({ title: "Menu unpublished", description: "Your menu is no longer live" })
                        }}
                        className="bg-white border-red-300 text-red-700 hover:bg-red-50 text-xs px-2 py-1 h-7"
                      >
                        <X className="h-3 w-3 mr-1 text-red-600" />
                        Unpublish
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Pushing to platforms...",
                            description: "Your menu is being synced to integrated platforms",
                          })
                        }}
                        className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 h-7"
                      >
                        <Upload className="h-3 w-3 mr-1 text-blue-600" />
                        Push
                      </Button>
                    </>
                  )}

                  {hasChanges && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHasChanges(false)
                        toast({
                          title: "Changes undone",
                          description: "Your menu has been reverted to the last published version",
                        })
                      }}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-2 py-1 h-7"
                    >
                      <RotateCcw className="h-3 w-3 mr-1 text-gray-600" />
                      Undo
                    </Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Menu Overview */}
        {hasMenu && (
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Menu Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">{menuOverview.score}/100</div>
                  <div className="text-xs text-gray-500 mb-1">Menu Score</div>
                  <div className="text-xs flex items-center justify-center text-green-600">
                    <ArrowUp className="h-3 w-3" />
                    <span className="ml-1">+{menuOverview.scoreChange}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">{menuOverview.totalItems}</div>
                  <div className="text-xs text-gray-500 mb-1">Total Items</div>
                  <div className="text-xs flex items-center justify-center text-green-600">
                    <ArrowUp className="h-3 w-3" />
                    <span className="ml-1">+{menuOverview.itemsChange} items</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">${menuOverview.aov.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mb-1">AOV</div>
                  <div className="text-xs flex items-center justify-center text-green-600">
                    <ArrowUp className="h-3 w-3" />
                    <span className="ml-1">+{menuOverview.aovChange}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">{menuOverview.totalOrders}</div>
                  <div className="text-xs text-gray-500 mb-1"># Orders</div>
                  <div className="text-xs flex items-center justify-center text-green-600">
                    <ArrowUp className="h-3 w-3" />
                    <span className="ml-1">+{menuOverview.ordersChange}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        {hasMenu && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0 rounded-none border-b">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="insights" className="relative">
                  Insights
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Menu Tab */}
              <TabsContent value="menu" className="m-0">
                <div className="p-4 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 h-10 text-sm"
                    />
                  </div>

                  {/* Menu Items - Fixed Mobile Layout */}
                  <div className="space-y-6 max-h-[600px] overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading menu items...</p>
                        </div>
                      </div>
                    ) : (
                      categories.map((category) => (
                        <div key={category.id} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                              {category.items.length} items
                            </Badge>
                          </div>
                          <div className="space-y-4">
                            {category.items.map((item) => (
                              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="p-4">
                                  <div className="space-y-3">
                                    {/* Top row: Title and Price */}
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-base leading-tight">
                                          {item.name}
                                        </h4>
                                      </div>
                                      <div className="ml-3 flex-shrink-0">
                                        <span className="text-lg font-bold text-gray-900">
                                          ${item.price.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Image and Description Row */}
                                    <div
                                      className="flex space-x-3"
                                      onClick={() => {
                                        setSelectedItemForDetails(item)
                                        setShowItemDetails(true)
                                      }}
                                    >
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                          <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement
                                              target.src = `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(item.name)}`
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <ImageIcon className="h-5 w-5 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Food tags */}
                                    <div className="flex flex-wrap gap-1">
                                      {item.dietaryTags.includes("Vegetarian") && (
                                        <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 text-xs">
                                          <Leaf className="h-3 w-3" /> Vegetarian
                                        </Badge>
                                      )}
                                      {item.dietaryTags.includes("Gluten-Free") && (
                                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 text-xs">
                                          <Wheat className="h-3 w-3" /> Gluten-Free
                                        </Badge>
                                      )}
                                      {item.allergens.length > 0 && (
                                        <Badge className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1 text-xs">
                                          <AlertTriangle className="h-3 w-3" /> Contains Allergens
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Bottom row: Stats and Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center">
                                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                          {item.rating}
                                        </div>
                                        {item.preparationTime && (
                                          <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1 text-gray-600" />
                                            {item.preparationTime}m
                                          </div>
                                        )}
                                        {item.isOutOfStock && (
                                          <div className="text-red-600 font-medium">Out of Stock</div>
                                        )}
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setEditingItem(item)
                                            setNewItem({
                                              name: item.name,
                                              description: item.description,
                                              price: item.price,
                                              category: item.category,
                                              image: item.image || "",
                                              dietaryTags: item.dietaryTags,
                                              allergens: item.allergens,
                                              customTags: [],
                                              spiceLevel: item.spiceLevel,
                                              preparationTime: item.preparationTime,
                                              costPrice: item.costPrice,
                                              calories: 0,
                                              protein: 0,
                                              carbs: 0,
                                              fat: 0,
                                              fiber: 0,
                                              variants: [],
                                              modifiers: [],
                                            })
                                            setShowEditDialog(true)
                                          }}
                                          className="h-7 px-3 text-xs bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant={item.isOutOfStock ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => {
                                            setCategories((prev) =>
                                              prev.map((cat) => ({
                                                ...cat,
                                                items: cat.items.map((i) =>
                                                  i.id === item.id ? { ...i, isOutOfStock: !i.isOutOfStock } : i,
                                                ),
                                              })),
                                            )
                                            setHasChanges(true)
                                            toast({
                                              title: !item.isOutOfStock
                                                ? "Item marked as out of stock"
                                                : "Item marked as available",
                                              description: `${item.name} status updated`,
                                            })
                                          }}
                                          className={`h-7 px-3 text-xs ${
                                            item.isOutOfStock
                                              ? "bg-green-600 hover:bg-green-700 text-white"
                                              : "bg-white text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                                          }`}
                                        >
                                          {item.isOutOfStock ? "Enable" : "Disable"}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="m-0">
                <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="border border-gray-200 bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900 text-sm">Price Optimization Opportunity</h3>
                                <Badge className="text-xs text-red-700 bg-red-50 border-red-200">high impact</Badge>
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">new</Badge>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                Margherita Pizza shows 40% higher demand. Consider increasing price by $2-3.
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="font-medium text-green-600">+$1,200/month</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                            <Button
                              onClick={() => {
                                setCategories((prev) =>
                                  prev.map((cat) => ({
                                    ...cat,
                                    items: cat.items.map((item) =>
                                      item.name === "Margherita Pizza" ? { ...item, price: item.price + 2.5 } : item,
                                    ),
                                  })),
                                )
                                setHasChanges(true)
                                toast({
                                  title: "Price updated!",
                                  description: "Margherita Pizza price increased by $2.50",
                                })
                              }}
                              className="bg-gray-900 hover:bg-gray-800 text-white text-xs h-7 px-3"
                              size="sm"
                            >
                              <Target className="h-3 w-3 mr-1 text-blue-400" />
                              Increase Price
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="m-0">
                <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
                  <div className="text-sm text-gray-600 mb-4">
                    Detailed performance analysis across different business areas
                  </div>
                  <div className="space-y-6">
                    <Card className="border border-gray-200 bg-white">
                      <CardHeader>
                        <CardTitle className="text-base text-gray-900">Category Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: "Pizza", orders: 203, revenue: 3349.5, growth: 18, avgRating: 4.8 },
                            { name: "Main Course", orders: 223, revenue: 4301.77, growth: 12, avgRating: 4.6 },
                            { name: "Salads", orders: 89, revenue: 1156.11, growth: -5, avgRating: 4.3 },
                          ].map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-sm text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-600">
                                  {item.orders} orders • Rating: {item.avgRating}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm text-gray-900">${item.revenue}</div>
                                <div
                                  className={`text-xs flex items-center justify-end ${item.growth > 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {item.growth > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="ml-1">{Math.abs(item.growth)}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Share Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">Share your menu on social media:</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  if (!menuLink) return
                  const text = "Check out our menu!"
                  const url = menuLink
                  window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`)
                  setShowShareDialog(false)
                }}
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white h-9"
              >
                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
              </Button>
              <Button
                onClick={() => {
                  if (!menuLink) return
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(menuLink)}`)
                  setShowShareDialog(false)
                }}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <Facebook className="h-4 w-4 mr-2" /> Facebook
              </Button>
              <Button
                onClick={() => {
                  if (!menuLink) return
                  const text = "Check out our menu!"
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(menuLink)}`,
                  )
                  setShowShareDialog(false)
                }}
                className="w-full justify-start bg-gray-900 hover:bg-gray-800 text-white h-9"
              >
                <Twitter className="h-4 w-4 mr-2" /> Twitter
              </Button>
              <Button
                onClick={() => {
                  if (!menuLink) return
                  navigator.clipboard.writeText(menuLink)
                  toast({ title: "Link copied!", description: "Paste it in your Instagram story or bio" })
                  setShowShareDialog(false)
                }}
                className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-9"
              >
                <Instagram className="h-4 w-4 mr-2" /> Instagram
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Details Sheet */}
      <ItemDetailsSheet
        item={selectedItemForDetails}
        isOpen={showItemDetails}
        onClose={() => {
          setShowItemDetails(false)
          setSelectedItemForDetails(null)
        }}
        onEdit={(item) => {
          setEditingItem(item)
          setNewItem({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image || "",
            dietaryTags: item.dietaryTags,
            allergens: item.allergens,
            customTags: [],
            spiceLevel: item.spiceLevel,
            preparationTime: item.preparationTime,
            costPrice: item.costPrice,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            variants: [],
            modifiers: [],
          })
          setShowEditDialog(true)
        }}
        onDelete={(itemId) => {
          handleDeleteItem(itemId)
          toast({ title: "Item deleted successfully!" })
        }}
        onImageUpload={(itemId) => {
          const input = document.createElement("input")
          input.type = "file"
          input.accept = "image/*"
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const imageUrl = URL.createObjectURL(file)
              setCategories((prev) =>
                prev.map((cat) => ({
                  ...cat,
                  items: cat.items.map((item) => (item.id === itemId ? { ...item, image: imageUrl } : item)),
                })),
              )
              toast({ title: "Image uploaded successfully!" })
              setHasChanges(true)
            }
          }
          input.click()
        }}
        onToggleStock={(itemId) => {
          setCategories((prev) =>
            prev.map((cat) => ({
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, isOutOfStock: !item.isOutOfStock } : item,
              ),
            })),
          )
          setHasChanges(true)
        }}
      />

      {/* Bulk Actions Dialog */}
      {showBulkActionsDialog && (
        <MenuBulkActions
          selectedItems={allItems.filter((item) => selectedItems.includes(item.id))}
          categories={categories}
          onAction={() => {}}
          onClose={() => setShowBulkActionsDialog(false)}
        />
      )}

      <AIMenuEnhancementDialog
        open={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        menuItems={allItems}
        categories={categories}
        onItemsUpdate={handleAIItemsUpdate}
        onCategoriesUpdate={handleAICategoriesUpdate}
        aiEndpoints={{
          combos: enhancedApiClient.generateMenuCombos.bind(enhancedApiClient),
          tags: enhancedApiClient.generateMenuTags.bind(enhancedApiClient),
          descriptions: "/api/ai/menu-descriptions",
          pricing: "/api/ai/menu-pricing",
          ordering: "/api/ai/menu-ordering",
        }}
      />
    </div>
  )
}

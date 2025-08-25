"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, Leaf, Sun, Snowflake, Flower, Eye, Save, Sparkles } from "lucide-react"
import { format } from "date-fns"

interface SeasonalTheme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  fonts: {
    heading: string
    body: string
    price: string
  }
  imagery: string
  mood: string
}

interface SeasonalMenu {
  id: string
  name: string
  season: "spring" | "summer" | "fall" | "winter"
  startDate: Date
  endDate: Date
  items: string[]
  theme: SeasonalTheme
  isActive: boolean
  description: string
  estimatedRevenue: string
}

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
}

const seasonalThemes = {
  spring: {
    colors: {
      primary: "#10b981",
      secondary: "#d1fae5",
      accent: "#059669",
      background: "#f0fdf4",
    },
    fonts: {
      heading: "Inter",
      body: "System UI",
      price: "Inter",
    },
    imagery: "fresh_greens",
    mood: "Fresh & Vibrant",
  },
  summer: {
    colors: {
      primary: "#f59e0b",
      secondary: "#fef3c7",
      accent: "#d97706",
      background: "#fffbeb",
    },
    fonts: {
      heading: "Montserrat",
      body: "Inter",
      price: "Montserrat",
    },
    imagery: "bright_citrus",
    mood: "Bright & Energetic",
  },
  fall: {
    colors: {
      primary: "#dc2626",
      secondary: "#fecaca",
      accent: "#b91c1c",
      background: "#fef2f2",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Georgia",
      price: "Playfair Display",
    },
    imagery: "warm_spices",
    mood: "Warm & Cozy",
  },
  winter: {
    colors: {
      primary: "#1e40af",
      secondary: "#dbeafe",
      accent: "#1d4ed8",
      background: "#eff6ff",
    },
    fonts: {
      heading: "Inter",
      body: "System UI",
      price: "Inter",
    },
    imagery: "comfort_foods",
    mood: "Elegant & Sophisticated",
  },
}

const getSeasonIcon = (season: string) => {
  switch (season) {
    case "spring":
      return Flower
    case "summer":
      return Sun
    case "fall":
      return Leaf
    case "winter":
      return Snowflake
    default:
      return Leaf
  }
}

export function SeasonalMenuManager() {
  const [seasonalMenus, setSeasonalMenus] = useState<SeasonalMenu[]>([])
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingMenu, setEditingMenu] = useState<SeasonalMenu | null>(null)
  const [previewMenu, setPreviewMenu] = useState<SeasonalMenu | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    season: "" as "spring" | "summer" | "fall" | "winter" | "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    selectedItems: [] as string[],
  })

  // Load data on component mount
  useEffect(() => {
    // Load existing seasonal menus
    const savedSeasonalMenus = localStorage.getItem("seasonalMenus")
    if (savedSeasonalMenus) {
      const menus = JSON.parse(savedSeasonalMenus).map((menu: any) => ({
        ...menu,
        startDate: new Date(menu.startDate),
        endDate: new Date(menu.endDate),
      }))
      setSeasonalMenus(menus)
    }

    // Load available menu items
    const savedMenuData = localStorage.getItem("currentMenuData")
    if (savedMenuData) {
      const menuData = JSON.parse(savedMenuData)
      const items = menuData.flatMap((category: any) =>
        category.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: category.name,
          price: item.price,
          description: item.description,
        })),
      )
      setAvailableItems(items)
    }
  }, [])

  const handleCreateMenu = () => {
    if (!formData.name || !formData.season || !formData.startDate || !formData.endDate) {
      return
    }

    const newMenu: SeasonalMenu = {
      id: Date.now().toString(),
      name: formData.name,
      season: formData.season,
      startDate: formData.startDate,
      endDate: formData.endDate,
      items: formData.selectedItems,
      theme: seasonalThemes[formData.season],
      isActive: false,
      description: formData.description,
      estimatedRevenue: "+$800-1,500/month",
    }

    const updatedMenus = [...seasonalMenus, newMenu]
    setSeasonalMenus(updatedMenus)
    localStorage.setItem("seasonalMenus", JSON.stringify(updatedMenus))

    // Reset form
    setFormData({
      name: "",
      season: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      selectedItems: [],
    })
    setShowCreateDialog(false)
  }

  const handleActivateMenu = (menuId: string) => {
    const updatedMenus = seasonalMenus.map((menu) => ({
      ...menu,
      isActive: menu.id === menuId ? !menu.isActive : menu.isActive,
    }))
    setSeasonalMenus(updatedMenus)
    localStorage.setItem("seasonalMenus", JSON.stringify(updatedMenus))

    // Apply theme to menu preview
    const activeMenu = updatedMenus.find((menu) => menu.id === menuId)
    if (activeMenu && activeMenu.isActive) {
      const designChanges = {
        colors: [
          { type: "color", property: "Primary Color", value: activeMenu.theme.colors.primary },
          { type: "color", property: "Secondary Color", value: activeMenu.theme.colors.secondary },
          { type: "color", property: "Accent Color", value: activeMenu.theme.colors.accent },
          { type: "color", property: "Background Color", value: activeMenu.theme.colors.background },
        ],
        fonts: [
          { type: "font", property: "Heading Font", value: activeMenu.theme.fonts.heading },
          { type: "font", property: "Body Font", value: activeMenu.theme.fonts.body },
          { type: "font", property: "Price Font", value: activeMenu.theme.fonts.price },
        ],
        appliedAt: Date.now(),
        seasonalMenu: {
          id: activeMenu.id,
          name: activeMenu.name,
          season: activeMenu.season,
        },
      }
      localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))
    }
  }

  const handlePreviewMenu = (menu: SeasonalMenu) => {
    // Apply theme temporarily for preview
    const designChanges = {
      colors: [
        { type: "color", property: "Primary Color", value: menu.theme.colors.primary },
        { type: "color", property: "Secondary Color", value: menu.theme.colors.secondary },
        { type: "color", property: "Accent Color", value: menu.theme.colors.accent },
        { type: "color", property: "Background Color", value: menu.theme.colors.background },
      ],
      fonts: [
        { type: "font", property: "Heading Font", value: menu.theme.fonts.heading },
        { type: "font", property: "Body Font", value: menu.theme.fonts.body },
        { type: "font", property: "Price Font", value: menu.theme.fonts.price },
      ],
      appliedAt: Date.now(),
      seasonalMenu: {
        id: menu.id,
        name: menu.name,
        season: menu.season,
      },
    }
    localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))
    window.open("/menu/preview", "_blank")
  }

  const handleDeleteMenu = (menuId: string) => {
    const updatedMenus = seasonalMenus.filter((menu) => menu.id !== menuId)
    setSeasonalMenus(updatedMenus)
    localStorage.setItem("seasonalMenus", JSON.stringify(updatedMenus))
  }

  const ThemePreview = ({ theme, season }: { theme: SeasonalTheme; season: string }) => {
    const SeasonIcon = getSeasonIcon(season)
    return (
      <div
        className="p-4 rounded-lg border-2 border-dashed"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.primary,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <SeasonIcon className="h-5 w-5" style={{ color: theme.colors.primary }} />
            <span
              className="font-semibold"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
            >
              {season.charAt(0).toUpperCase() + season.slice(1)} Menu
            </span>
          </div>
          <div className="flex space-x-1">
            {Object.values(theme.colors).map((color, index) => (
              <div key={index} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div
            className="text-sm"
            style={{
              color: theme.colors.accent,
              fontFamily: theme.fonts.body,
            }}
          >
            Sample Menu Item
          </div>
          <div className="text-xs text-gray-600">Mood: {theme.mood}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seasonal Menu Manager</h2>
          <p className="text-gray-600">Create and manage seasonal menu themes and layouts</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Seasonal Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Seasonal Menu</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Menu Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Fresh Menu"
                  />
                </div>
                <div>
                  <Label>Season</Label>
                  <Select
                    value={formData.season}
                    onValueChange={(value: any) => setFormData({ ...formData, season: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="fall">Fall</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the seasonal menu theme and concept"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Theme Preview */}
              {formData.season && (
                <div>
                  <Label>Theme Preview</Label>
                  <ThemePreview theme={seasonalThemes[formData.season]} season={formData.season} />
                </div>
              )}

              {/* Menu Items Selection */}
              <div>
                <Label>Select Menu Items</Label>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {availableItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={formData.selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              selectedItems: [...formData.selectedItems, item.id],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              selectedItems: formData.selectedItems.filter((id) => id !== item.id),
                            })
                          }
                        }}
                      />
                      <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">${item.price}</span>
                        <span className="text-gray-400 ml-2">• {item.category}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">{formData.selectedItems.length} items selected</div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMenu} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Create Menu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Seasonal Menus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seasonalMenus.map((menu) => {
          const SeasonIcon = getSeasonIcon(menu.season)
          return (
            <Card
              key={menu.id}
              className={`border-2 ${menu.isActive ? "border-green-500 bg-green-50" : "border-gray-200"}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SeasonIcon className="h-5 w-5" style={{ color: menu.theme.colors.primary }} />
                    <CardTitle className="text-lg">{menu.name}</CardTitle>
                  </div>
                  {menu.isActive && (
                    <Badge className="bg-green-600 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{menu.description}</p>

                {/* Theme Preview */}
                <ThemePreview theme={menu.theme} season={menu.season} />

                {/* Menu Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">
                      {format(menu.startDate, "MMM d")} - {format(menu.endDate, "MMM d")}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Items</div>
                    <div className="font-medium">{menu.items.length} items</div>
                  </div>
                </div>

                {/* Revenue Estimate */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-700 font-medium">Estimated Revenue Impact</div>
                  <div className="text-lg font-bold text-green-800">{menu.estimatedRevenue}</div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreviewMenu(menu)} className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleActivateMenu(menu.id)}
                    className={`flex-1 ${
                      menu.isActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {menu.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {seasonalMenus.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Seasonal Menus Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create seasonal menu themes to automatically update your menu design and highlight seasonal items.
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Seasonal Menu
          </Button>
        </div>
      )}
    </div>
  )
}

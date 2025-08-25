"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Upload,
  Camera,
  FileText,
  Download,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Save,
  Loader2,
  BarChart3,
  TrendingUp,
  DollarSign,
  Star,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Clock,
  Utensils,
  Coffee,
  ShoppingCart,
  MapPin,
  Leaf,
  Heart,
  Shield,
} from "lucide-react"

interface MenuDataFormProps {
  onSave?: (data: any) => Promise<void>
  saving?: boolean
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  dietary_tags: string[]
  availability: boolean
  variants?: Array<{
    name: string
    price: number
  }>
}

interface MultiSelectFieldProps {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  allowCustom?: boolean
  placeholder?: string
  description?: string
}

function MultiSelectField({
  label,
  options,
  value,
  onChange,
  allowCustom = true,
  placeholder,
  description,
}: MultiSelectFieldProps) {
  const [customValue, setCustomValue] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleToggle = (option: string) => {
    const newValue = value.includes(option) ? value.filter((v) => v !== option) : [...value, option]
    onChange(newValue)
  }

  const handleAddCustom = () => {
    if (customValue.trim() && !value.includes(customValue.trim())) {
      onChange([...value, customValue.trim()])
      setCustomValue("")
      setShowCustomInput(false)
    }
  }

  const handleRemove = (option: string) => {
    onChange(value.filter((v) => v !== option))
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <Badge key={item} variant="secondary" className="px-2 py-1">
              {item}
              <button onClick={() => handleRemove(item)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Options grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${label}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            />
            <Label htmlFor={`${label}-${option}`} className="text-sm cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Custom Option
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Input
                placeholder={placeholder || "Enter custom option"}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
              />
              <Button type="button" size="sm" onClick={handleAddCustom}>
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomValue("")
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function MenuDataForm({ onSave, saving = false }: MenuDataFormProps) {
  const [activeTab, setActiveTab] = useState("input")
  const [inputMethod, setInputMethod] = useState("")
  const [processing, setProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState("")
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    combos: false,
    beverages: false,
    dietary: false,
    pricing: false,
    availability: false,
    categories: false,
    descriptions: false,
    allergens: false,
    nutrition: false,
    promotions: false,
    seasonal: false,
    delivery: false,
    loyalty: false,
    social: false,
    analytics: false,
  })

  const [formData, setFormData] = useState({
    // Basic Information
    restaurant_id: "",
    menu_name: "",
    menu_description: "",
    input_method: "",
    raw_menu_text: "",
    menu_file_url: "",

    // Combos & Offers (from CSV)
    all_combos: [] as string[],
    combo_descriptions: "",
    combo_pricing: "",
    special_offers: [] as string[],
    happy_hour_items: [] as string[],
    lunch_specials: [] as string[],
    dinner_specials: [] as string[],
    weekend_specials: [] as string[],
    family_meals: [] as string[],
    group_packages: [] as string[],
    seasonal_combos: [] as string[],

    // Beverages (from CSV)
    alcoholic_beverages: [] as string[],
    non_alcoholic_beverages: [] as string[],
    hot_beverages: [] as string[],
    cold_beverages: [] as string[],
    specialty_drinks: [] as string[],
    wine_list: [] as string[],
    beer_selection: [] as string[],
    cocktail_menu: [] as string[],
    mocktails: [] as string[],
    fresh_juices: [] as string[],
    smoothies: [] as string[],
    tea_varieties: [] as string[],
    coffee_specialties: [] as string[],

    // Dietary & Restrictions (from CSV)
    vegetarian_options: [] as string[],
    vegan_options: [] as string[],
    gluten_free_options: [] as string[],
    dairy_free_options: [] as string[],
    nut_free_options: [] as string[],
    keto_friendly: [] as string[],
    low_carb_options: [] as string[],
    healthy_options: [] as string[],
    sugar_free_options: [] as string[],
    low_sodium_options: [] as string[],
    organic_options: [] as string[],
    raw_food_options: [] as string[],

    // Pricing Structure (from CSV)
    price_ranges: [] as string[],
    currency: "USD",
    tax_included: false,
    service_charge: "",
    minimum_order: "",
    delivery_charges: "",
    packaging_charges: "",
    discount_structure: "",
    loyalty_pricing: "",
    bulk_order_discounts: "",

    // Availability & Timing (from CSV)
    breakfast_items: [] as string[],
    lunch_items: [] as string[],
    dinner_items: [] as string[],
    late_night_menu: [] as string[],
    seasonal_items: [] as string[],
    limited_time_offers: [] as string[],
    all_day_menu: [] as string[],
    brunch_items: [] as string[],
    holiday_specials: [] as string[],

    // Categories & Organization (from CSV)
    appetizers: [] as string[],
    main_courses: [] as string[],
    desserts: [] as string[],
    sides: [] as string[],
    salads: [] as string[],
    soups: [] as string[],
    sandwiches: [] as string[],
    pasta_dishes: [] as string[],
    pizza_options: [] as string[],
    rice_dishes: [] as string[],
    noodle_dishes: [] as string[],
    grilled_items: [] as string[],
    fried_items: [] as string[],
    baked_items: [] as string[],

    // Descriptions & Details (from CSV)
    chef_specials: [] as string[],
    signature_dishes: [] as string[],
    popular_items: [] as string[],
    new_items: [] as string[],
    recommended_items: [] as string[],
    house_favorites: [] as string[],
    customer_favorites: [] as string[],
    award_winning_dishes: [] as string[],

    // Allergens & Nutrition (from CSV)
    common_allergens: [] as string[],
    nutritional_info_available: false,
    calorie_counts: false,
    ingredient_lists: false,
    allergen_warnings: [] as string[],
    nutrition_labels: false,
    health_certifications: [] as string[],

    // Promotions & Marketing (from CSV)
    featured_items: [] as string[],
    promotional_items: [] as string[],
    loyalty_program_items: [] as string[],
    social_media_worthy: [] as string[],
    instagram_specials: [] as string[],
    review_incentives: [] as string[],

    // Seasonal & Special (from CSV)
    seasonal_ingredients: [] as string[],
    local_sourced_items: [] as string[],
    farm_to_table: [] as string[],
    sustainable_options: [] as string[],
    eco_friendly_packaging: false,

    // Delivery & Takeout (from CSV)
    delivery_only_items: [] as string[],
    takeout_specials: [] as string[],
    packaging_options: [] as string[],
    delivery_zones: [] as string[],
    delivery_time_slots: [] as string[],
    contactless_delivery: false,

    // Loyalty & Rewards (from CSV)
    loyalty_rewards: [] as string[],
    membership_benefits: [] as string[],
    referral_rewards: [] as string[],
    birthday_specials: [] as string[],
    anniversary_offers: [] as string[],

    // Social & Community (from CSV)
    community_events: [] as string[],
    charity_partnerships: [] as string[],
    local_collaborations: [] as string[],
    social_causes: [] as string[],

    // Analytics & Insights (from CSV)
    popular_times: [] as string[],
    peak_hours: [] as string[],
    seasonal_trends: [] as string[],
    customer_preferences: [] as string[],
    sales_patterns: [] as string[],

    // Processing data
    parsed_categories: [] as string[],
    parsed_items: [] as MenuItem[],
    pricing_analysis: {
      average_price: 0,
      price_range: { min: 0, max: 0 },
      category_averages: {} as Record<string, number>,
    },
    pos_integration: "",
    processing_status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  // Sample parsed menu items with realistic data
  const sampleMenuItems: MenuItem[] = [
    {
      id: "1",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, parmesan cheese, croutons, and our signature Caesar dressing",
      price: 12.99,
      category: "Appetizers",
      dietary_tags: ["Vegetarian"],
      availability: true,
      variants: [
        { name: "Regular", price: 12.99 },
        { name: "Large", price: 16.99 },
      ],
    },
    {
      id: "2",
      name: "Buffalo Wings",
      description: "Crispy chicken wings tossed in spicy buffalo sauce, served with celery and blue cheese",
      price: 14.99,
      category: "Appetizers",
      dietary_tags: ["Spicy", "Popular"],
      availability: true,
    },
    {
      id: "3",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter",
      price: 28.99,
      category: "Main Courses",
      dietary_tags: ["Gluten-Free", "Healthy"],
      availability: true,
    },
    {
      id: "4",
      name: "Ribeye Steak",
      description: "12oz prime ribeye steak cooked to your preference, served with mashed potatoes and asparagus",
      price: 34.99,
      category: "Main Courses",
      dietary_tags: ["Popular"],
      availability: true,
      variants: [
        { name: "12oz", price: 34.99 },
        { name: "16oz", price: 42.99 },
      ],
    },
    {
      id: "5",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
      price: 8.99,
      category: "Desserts",
      dietary_tags: ["Popular"],
      availability: true,
    },
    {
      id: "6",
      name: "Craft Beer Selection",
      description: "Rotating selection of local craft beers on tap",
      price: 6.99,
      category: "Beverages",
      dietary_tags: [],
      availability: true,
      variants: [
        { name: "Pint", price: 6.99 },
        { name: "Half Pint", price: 4.99 },
      ],
    },
  ]

  const handleInputMethodChange = (method: string) => {
    setInputMethod(method)
    setFormData((prev) => ({ ...prev, input_method: method }))
  }

  const simulateAIProcessing = useCallback(async () => {
    setProcessing(true)
    setProcessingProgress(0)

    const steps = [
      { step: "Analyzing menu content...", duration: 1000 },
      { step: "Extracting menu items...", duration: 1500 },
      { step: "Identifying categories...", duration: 1000 },
      { step: "Parsing prices and descriptions...", duration: 1200 },
      { step: "Analyzing pricing structure...", duration: 800 },
      { step: "Finalizing menu data...", duration: 500 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i].step)
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
      setProcessingProgress(((i + 1) / steps.length) * 100)
    }

    // Update form data with processed results
    setFormData((prev) => ({
      ...prev,
      parsed_categories: ["Appetizers", "Main Courses", "Desserts", "Beverages"],
      parsed_items: sampleMenuItems,
      pricing_analysis: {
        average_price: 18.5,
        price_range: { min: 6.99, max: 42.99 },
        category_averages: {
          Appetizers: 13.99,
          "Main Courses": 31.99,
          Desserts: 8.99,
          Beverages: 6.99,
        },
      },
      processing_status: "completed",
    }))

    setProcessing(false)
    setActiveTab("setup")
  }, [])

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData)
    }
  }

  const getDietaryTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      Vegetarian: "bg-green-100 text-green-700",
      Vegan: "bg-green-100 text-green-700",
      "Gluten-Free": "bg-blue-100 text-blue-700",
      Spicy: "bg-red-100 text-red-700",
      Popular: "bg-yellow-100 text-yellow-700",
      Healthy: "bg-emerald-100 text-emerald-700",
    }
    return colors[tag] || "bg-gray-100 text-gray-700"
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menu Data Setup</h2>
          <p className="text-gray-600">Configure your comprehensive menu data and pricing structure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {formData.processing_status === "completed" ? "Processed" : "Pending"}
          </Badge>
          <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Menu Data
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="input">Input Method</TabsTrigger>
          <TabsTrigger value="content">Menu Content</TabsTrigger>
          <TabsTrigger value="setup">Menu Setup</TabsTrigger>
          <TabsTrigger value="parsed">Menu Items</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Input Method Tab */}
        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Choose Input Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant={inputMethod === "upload" ? "default" : "outline"}
                  className="h-24 flex-col gap-2 bg-transparent"
                  onClick={() => handleInputMethodChange("upload")}
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload Menu</span>
                </Button>
                <Button
                  variant={inputMethod === "scan" ? "default" : "outline"}
                  className="h-24 flex-col gap-2 bg-transparent"
                  onClick={() => handleInputMethodChange("scan")}
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-sm">Scan Menu</span>
                </Button>
                <Button
                  variant={inputMethod === "manual" ? "default" : "outline"}
                  className="h-24 flex-col gap-2 bg-transparent"
                  onClick={() => handleInputMethodChange("manual")}
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Manual Entry</span>
                </Button>
                <Button
                  variant={inputMethod === "import" ? "default" : "outline"}
                  className="h-24 flex-col gap-2 bg-transparent"
                  onClick={() => handleInputMethodChange("import")}
                >
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Import from POS</span>
                </Button>
              </div>

              {inputMethod && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {inputMethod === "upload" && "Upload Menu Files"}
                    {inputMethod === "scan" && "Scan Menu with Camera"}
                    {inputMethod === "manual" && "Manual Menu Entry"}
                    {inputMethod === "import" && "Import from POS System"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {inputMethod === "upload" &&
                      "Upload PDF, image, or text files of your menu. Our AI will extract all items and pricing."}
                    {inputMethod === "scan" &&
                      "Use your device camera to scan physical menu pages. Perfect for printed menus."}
                    {inputMethod === "manual" &&
                      "Type or paste your menu content directly. Great for quick setup or text-based menus."}
                    {inputMethod === "import" &&
                      "Connect your POS system to automatically import menu items and current pricing."}
                  </p>

                  {inputMethod === "upload" && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                      <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.txt" className="hidden" />
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  )}

                  {inputMethod === "scan" && (
                    <div className="bg-white border rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-4">Camera scanning will be available on mobile devices</p>
                      <Button variant="outline" size="sm">
                        Open Camera
                      </Button>
                    </div>
                  )}

                  {inputMethod === "import" && (
                    <div className="space-y-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your POS system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toast">Toast POS</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="petpooja">Petpooja</SelectItem>
                          <SelectItem value="clover">Clover</SelectItem>
                          <SelectItem value="lightspeed">Lightspeed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full">Connect POS System</Button>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button onClick={simulateAIProcessing} disabled={processing}>
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Process Menu
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Status */}
          {processing && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Processing Menu Data</span>
                  </div>
                  <p className="text-sm text-gray-600">{processingStep}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{Math.round(processingProgress)}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Menu Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="menu-name">Menu Name</Label>
                  <Input
                    id="menu-name"
                    placeholder="e.g., Main Menu, Lunch Menu, Dinner Menu"
                    value={formData.menu_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, menu_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-description">Menu Description</Label>
                  <Textarea
                    id="menu-description"
                    placeholder="Brief description of your menu offerings..."
                    value={formData.menu_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, menu_description: e.target.value }))}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Menu Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="raw-content">Menu Text</Label>
                  <Textarea
                    id="raw-content"
                    placeholder="Paste your menu content here..."
                    value={formData.raw_menu_text}
                    onChange={(e) => setFormData((prev) => ({ ...prev, raw_menu_text: e.target.value }))}
                    className="min-h-[200px] resize-none font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Menu Setup Tab - Complete field structure based on CSV */}
        <TabsContent value="setup" className="space-y-6">
          <div className="space-y-6">
            {/* Combos & Offers Section */}
            <Card>
              <Collapsible open={expandedSections.combos} onOpenChange={() => toggleSection("combos")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Combos & Offers
                      </div>
                      {expandedSections.combos ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <MultiSelectField
                      label="All Combos"
                      description="Combos referencing menu items"
                      options={[
                        "Family Meal Deal",
                        "Couple's Special",
                        "Business Lunch",
                        "Weekend Brunch",
                        "Date Night Package",
                        "Group Feast",
                        "Student Combo",
                      ]}
                      value={formData.all_combos}
                      onChange={(value) => updateFormField("all_combos", value)}
                      placeholder="Enter combo name"
                    />

                    <div className="space-y-2">
                      <Label>Combo Descriptions</Label>
                      <Textarea
                        placeholder="Describe your combo offerings and what's included..."
                        value={formData.combo_descriptions}
                        onChange={(e) => updateFormField("combo_descriptions", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Special Offers"
                        options={[
                          "Buy 1 Get 1 Free",
                          "Student Discount 20%",
                          "Senior Discount 15%",
                          "Military Discount 10%",
                          "Birthday Special",
                          "Anniversary Deal",
                          "First Time Customer",
                        ]}
                        value={formData.special_offers}
                        onChange={(value) => updateFormField("special_offers", value)}
                      />

                      <MultiSelectField
                        label="Happy Hour Items"
                        options={[
                          "Appetizer Specials",
                          "Drink Specials",
                          "Wine Selection",
                          "Beer Deals",
                          "Cocktail Hour",
                          "Small Plates",
                        ]}
                        value={formData.happy_hour_items}
                        onChange={(value) => updateFormField("happy_hour_items", value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MultiSelectField
                        label="Lunch Specials"
                        options={["Express Lunch", "Soup & Sandwich", "Salad Combo", "Quick Bites", "Power Lunch"]}
                        value={formData.lunch_specials}
                        onChange={(value) => updateFormField("lunch_specials", value)}
                      />

                      <MultiSelectField
                        label="Dinner Specials"
                        options={[
                          "Chef's Choice",
                          "Prix Fixe Menu",
                          "Wine Pairing",
                          "Tasting Menu",
                          "Seasonal Special",
                        ]}
                        value={formData.dinner_specials}
                        onChange={(value) => updateFormField("dinner_specials", value)}
                      />

                      <MultiSelectField
                        label="Weekend Specials"
                        options={["Brunch Special", "Sunday Roast", "Weekend Buffet", "Family Package", "Date Night"]}
                        value={formData.weekend_specials}
                        onChange={(value) => updateFormField("weekend_specials", value)}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Beverages Section */}
            <Card>
              <Collapsible open={expandedSections.beverages} onOpenChange={() => toggleSection("beverages")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-5 w-5" />
                        Beverages
                      </div>
                      {expandedSections.beverages ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Alcoholic Beverages"
                        options={[
                          "Wine",
                          "Beer",
                          "Cocktails",
                          "Spirits",
                          "Champagne",
                          "Sake",
                          "Whiskey",
                          "Vodka",
                          "Rum",
                          "Gin",
                        ]}
                        value={formData.alcoholic_beverages}
                        onChange={(value) => updateFormField("alcoholic_beverages", value)}
                      />

                      <MultiSelectField
                        label="Non-Alcoholic Beverages"
                        options={[
                          "Soft Drinks",
                          "Juices",
                          "Water",
                          "Mocktails",
                          "Energy Drinks",
                          "Sports Drinks",
                          "Kombucha",
                        ]}
                        value={formData.non_alcoholic_beverages}
                        onChange={(value) => updateFormField("non_alcoholic_beverages", value)}
                      />

                      <MultiSelectField
                        label="Hot Beverages"
                        options={[
                          "Coffee",
                          "Tea",
                          "Hot Chocolate",
                          "Espresso",
                          "Cappuccino",
                          "Latte",
                          "Americano",
                          "Macchiato",
                        ]}
                        value={formData.hot_beverages}
                        onChange={(value) => updateFormField("hot_beverages", value)}
                      />

                      <MultiSelectField
                        label="Cold Beverages"
                        options={[
                          "Iced Coffee",
                          "Iced Tea",
                          "Smoothies",
                          "Milkshakes",
                          "Fresh Juices",
                          "Frappés",
                          "Cold Brew",
                        ]}
                        value={formData.cold_beverages}
                        onChange={(value) => updateFormField("cold_beverages", value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MultiSelectField
                        label="Wine List"
                        options={[
                          "Red Wine",
                          "White Wine",
                          "Rosé",
                          "Sparkling",
                          "Dessert Wine",
                          "House Wine",
                          "Premium Selection",
                        ]}
                        value={formData.wine_list}
                        onChange={(value) => updateFormField("wine_list", value)}
                      />

                      <MultiSelectField
                        label="Beer Selection"
                        options={[
                          "Draft Beer",
                          "Bottled Beer",
                          "Craft Beer",
                          "Local Brewery",
                          "Import Beer",
                          "Light Beer",
                          "IPA",
                        ]}
                        value={formData.beer_selection}
                        onChange={(value) => updateFormField("beer_selection", value)}
                      />

                      <MultiSelectField
                        label="Specialty Drinks"
                        options={[
                          "Signature Cocktails",
                          "House Specials",
                          "Seasonal Drinks",
                          "Artisan Coffee",
                          "Fresh Smoothies",
                          "Infused Waters",
                        ]}
                        value={formData.specialty_drinks}
                        onChange={(value) => updateFormField("specialty_drinks", value)}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Dietary & Restrictions Section */}
            <Card>
              <Collapsible open={expandedSections.dietary} onOpenChange={() => toggleSection("dietary")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Dietary & Health Options
                      </div>
                      {expandedSections.dietary ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Vegetarian Options"
                        options={[
                          "Veggie Burgers",
                          "Garden Salads",
                          "Vegetarian Pasta",
                          "Veggie Soups",
                          "Plant-based Appetizers",
                          "Veggie Pizza",
                        ]}
                        value={formData.vegetarian_options}
                        onChange={(value) => updateFormField("vegetarian_options", value)}
                      />

                      <MultiSelectField
                        label="Vegan Options"
                        options={[
                          "Plant-based Proteins",
                          "Vegan Desserts",
                          "Dairy-free Options",
                          "Vegan Appetizers",
                          "Cashew-based Dishes",
                          "Tofu Specials",
                        ]}
                        value={formData.vegan_options}
                        onChange={(value) => updateFormField("vegan_options", value)}
                      />

                      <MultiSelectField
                        label="Gluten-Free Options"
                        options={[
                          "GF Bread",
                          "GF Pasta",
                          "GF Pizza",
                          "GF Desserts",
                          "GF Appetizers",
                          "GF Wraps",
                          "GF Salads",
                        ]}
                        value={formData.gluten_free_options}
                        onChange={(value) => updateFormField("gluten_free_options", value)}
                      />

                      <MultiSelectField
                        label="Keto-Friendly"
                        options={[
                          "Low-carb Entrees",
                          "Keto Salads",
                          "Protein Bowls",
                          "Keto Desserts",
                          "Cauliflower Dishes",
                          "Avocado Specials",
                        ]}
                        value={formData.keto_friendly}
                        onChange={(value) => updateFormField("keto_friendly", value)}
                      />

                      <MultiSelectField
                        label="Healthy Options"
                        options={[
                          "Grilled Items",
                          "Steamed Vegetables",
                          "Fresh Salads",
                          "Lean Proteins",
                          "Whole Grains",
                          "Quinoa Bowls",
                        ]}
                        value={formData.healthy_options}
                        onChange={(value) => updateFormField("healthy_options", value)}
                      />

                      <MultiSelectField
                        label="Organic Options"
                        options={[
                          "Organic Vegetables",
                          "Organic Meats",
                          "Organic Dairy",
                          "Organic Grains",
                          "Organic Fruits",
                          "Organic Herbs",
                        ]}
                        value={formData.organic_options}
                        onChange={(value) => updateFormField("organic_options", value)}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Categories & Organization Section */}
            <Card>
              <Collapsible open={expandedSections.categories} onOpenChange={() => toggleSection("categories")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-5 w-5" />
                        Menu Categories
                      </div>
                      {expandedSections.categories ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <MultiSelectField
                        label="Appetizers"
                        options={[
                          "Wings",
                          "Nachos",
                          "Bruschetta",
                          "Calamari",
                          "Sliders",
                          "Spring Rolls",
                          "Dumplings",
                          "Cheese Platters",
                        ]}
                        value={formData.appetizers}
                        onChange={(value) => updateFormField("appetizers", value)}
                      />

                      <MultiSelectField
                        label="Main Courses"
                        options={[
                          "Steaks",
                          "Seafood",
                          "Chicken",
                          "Pork",
                          "Lamb",
                          "Vegetarian Entrees",
                          "Pasta",
                          "Rice Dishes",
                        ]}
                        value={formData.main_courses}
                        onChange={(value) => updateFormField("main_courses", value)}
                      />

                      <MultiSelectField
                        label="Desserts"
                        options={[
                          "Cakes",
                          "Ice Cream",
                          "Pies",
                          "Cookies",
                          "Pastries",
                          "Tiramisu",
                          "Cheesecake",
                          "Fruit Tarts",
                        ]}
                        value={formData.desserts}
                        onChange={(value) => updateFormField("desserts", value)}
                      />

                      <MultiSelectField
                        label="Salads"
                        options={["Caesar", "Greek", "Garden", "Cobb", "Spinach", "Arugula", "Quinoa", "Fruit Salads"]}
                        value={formData.salads}
                        onChange={(value) => updateFormField("salads", value)}
                      />

                      <MultiSelectField
                        label="Soups"
                        options={[
                          "Tomato",
                          "Chicken Noodle",
                          "Minestrone",
                          "Clam Chowder",
                          "French Onion",
                          "Mushroom",
                          "Lentil",
                        ]}
                        value={formData.soups}
                        onChange={(value) => updateFormField("soups", value)}
                      />

                      <MultiSelectField
                        label="Pizza Options"
                        options={[
                          "Margherita",
                          "Pepperoni",
                          "Supreme",
                          "Vegetarian",
                          "Meat Lovers",
                          "Hawaiian",
                          "BBQ Chicken",
                        ]}
                        value={formData.pizza_options}
                        onChange={(value) => updateFormField("pizza_options", value)}
                      />

                      <MultiSelectField
                        label="Sandwiches"
                        options={["Club Sandwich", "BLT", "Grilled Cheese", "Panini", "Wraps", "Burgers", "Subs"]}
                        value={formData.sandwiches}
                        onChange={(value) => updateFormField("sandwiches", value)}
                      />

                      <MultiSelectField
                        label="Pasta Dishes"
                        options={["Spaghetti", "Fettuccine", "Penne", "Lasagna", "Ravioli", "Carbonara", "Bolognese"]}
                        value={formData.pasta_dishes}
                        onChange={(value) => updateFormField("pasta_dishes", value)}
                      />

                      <MultiSelectField
                        label="Sides"
                        options={[
                          "French Fries",
                          "Onion Rings",
                          "Coleslaw",
                          "Mashed Potatoes",
                          "Rice",
                          "Vegetables",
                          "Bread",
                        ]}
                        value={formData.sides}
                        onChange={(value) => updateFormField("sides", value)}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Pricing Structure Section */}
            <Card>
              <Collapsible open={expandedSections.pricing} onOpenChange={() => toggleSection("pricing")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pricing Structure
                      </div>
                      {expandedSections.pricing ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Price Ranges"
                        options={["$5-10", "$10-15", "$15-20", "$20-25", "$25-30", "$30-40", "$40+"]}
                        value={formData.price_ranges}
                        onChange={(value) => updateFormField("price_ranges", value)}
                      />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select
                            value={formData.currency}
                            onValueChange={(value) => updateFormField("currency", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                              <SelectItem value="AUD">AUD (A$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="tax-included"
                            checked={formData.tax_included}
                            onCheckedChange={(checked) => updateFormField("tax_included", checked)}
                          />
                          <Label htmlFor="tax-included">Tax included in prices</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Service Charge (%)</Label>
                        <Input
                          placeholder="e.g., 10"
                          value={formData.service_charge}
                          onChange={(e) => updateFormField("service_charge", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Order</Label>
                        <Input
                          placeholder="e.g., $15"
                          value={formData.minimum_order}
                          onChange={(e) => updateFormField("minimum_order", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Charges</Label>
                        <Input
                          placeholder="e.g., $3.99"
                          value={formData.delivery_charges}
                          onChange={(e) => updateFormField("delivery_charges", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Availability & Timing Section */}
            <Card>
              <Collapsible open={expandedSections.availability} onOpenChange={() => toggleSection("availability")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Availability & Timing
                      </div>
                      {expandedSections.availability ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Breakfast Items"
                        options={[
                          "Pancakes",
                          "Eggs Benedict",
                          "Omelettes",
                          "French Toast",
                          "Breakfast Burrito",
                          "Waffles",
                          "Bagels",
                        ]}
                        value={formData.breakfast_items}
                        onChange={(value) => updateFormField("breakfast_items", value)}
                      />

                      <MultiSelectField
                        label="Lunch Items"
                        options={["Sandwiches", "Salads", "Soups", "Wraps", "Burgers", "Quick Bites", "Business Lunch"]}
                        value={formData.lunch_items}
                        onChange={(value) => updateFormField("lunch_items", value)}
                      />

                      <MultiSelectField
                        label="Dinner Items"
                        options={["Steaks", "Seafood", "Pasta", "Risotto", "Roasts", "Fine Dining", "Chef Specials"]}
                        value={formData.dinner_items}
                        onChange={(value) => updateFormField("dinner_items", value)}
                      />

                      <MultiSelectField
                        label="Late Night Menu"
                        options={["Bar Snacks", "Light Bites", "Desserts", "Appetizers", "Pizza Slices", "Wings"]}
                        value={formData.late_night_menu}
                        onChange={(value) => updateFormField("late_night_menu", value)}
                      />
                    </div>

                    <MultiSelectField
                      label="Seasonal Items"
                      options={[
                        "Summer Specials",
                        "Winter Warmers",
                        "Holiday Menu",
                        "Spring Fresh",
                        "Fall Favorites",
                        "Limited Time",
                      ]}
                      value={formData.seasonal_items}
                      onChange={(value) => updateFormField("seasonal_items", value)}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Delivery & Takeout Section */}
            <Card>
              <Collapsible open={expandedSections.delivery} onOpenChange={() => toggleSection("delivery")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Delivery & Takeout
                      </div>
                      {expandedSections.delivery ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Delivery Only Items"
                        options={["Family Packs", "Bulk Orders", "Party Platters", "Catering Boxes", "Meal Kits"]}
                        value={formData.delivery_only_items}
                        onChange={(value) => updateFormField("delivery_only_items", value)}
                      />

                      <MultiSelectField
                        label="Takeout Specials"
                        options={["Grab & Go", "Express Meals", "Lunch Boxes", "Quick Pickup", "Pre-order Specials"]}
                        value={formData.takeout_specials}
                        onChange={(value) => updateFormField("takeout_specials", value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="contactless-delivery"
                        checked={formData.contactless_delivery}
                        onCheckedChange={(checked) => updateFormField("contactless_delivery", checked)}
                      />
                      <Label htmlFor="contactless-delivery">Contactless delivery available</Label>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Allergens & Nutrition Section */}
            <Card>
              <Collapsible open={expandedSections.allergens} onOpenChange={() => toggleSection("allergens")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Allergens & Nutrition
                      </div>
                      {expandedSections.allergens ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <MultiSelectField
                      label="Common Allergens"
                      options={["Nuts", "Dairy", "Gluten", "Eggs", "Soy", "Shellfish", "Fish", "Sesame"]}
                      value={formData.common_allergens}
                      onChange={(value) => updateFormField("common_allergens", value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="nutritional-info"
                          checked={formData.nutritional_info_available}
                          onCheckedChange={(checked) => updateFormField("nutritional_info_available", checked)}
                        />
                        <Label htmlFor="nutritional-info">Nutritional info available</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="calorie-counts"
                          checked={formData.calorie_counts}
                          onCheckedChange={(checked) => updateFormField("calorie_counts", checked)}
                        />
                        <Label htmlFor="calorie-counts">Calorie counts shown</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ingredient-lists"
                          checked={formData.ingredient_lists}
                          onCheckedChange={(checked) => updateFormField("ingredient_lists", checked)}
                        />
                        <Label htmlFor="ingredient-lists">Ingredient lists available</Label>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Sustainability Section */}
            <Card>
              <Collapsible open={expandedSections.seasonal} onOpenChange={() => toggleSection("seasonal")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5" />
                        Sustainability & Local Sourcing
                      </div>
                      {expandedSections.seasonal ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiSelectField
                        label="Local Sourced Items"
                        options={[
                          "Local Vegetables",
                          "Local Meats",
                          "Local Dairy",
                          "Local Seafood",
                          "Local Herbs",
                          "Local Fruits",
                        ]}
                        value={formData.local_sourced_items}
                        onChange={(value) => updateFormField("local_sourced_items", value)}
                      />

                      <MultiSelectField
                        label="Sustainable Options"
                        options={[
                          "Organic Ingredients",
                          "Fair Trade",
                          "Sustainable Seafood",
                          "Free Range",
                          "Grass Fed",
                          "Eco-friendly",
                        ]}
                        value={formData.sustainable_options}
                        onChange={(value) => updateFormField("sustainable_options", value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="eco-packaging"
                        checked={formData.eco_friendly_packaging}
                        onCheckedChange={(checked) => updateFormField("eco_friendly_packaging", checked)}
                      />
                      <Label htmlFor="eco-packaging">Eco-friendly packaging used</Label>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </TabsContent>

        {/* Parsed Items Tab */}
        <TabsContent value="parsed" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Parsed Menu Items</h3>
              <p className="text-sm text-gray-600">
                {formData.parsed_items.length} items found across {formData.parsed_categories.length} categories
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("preview")}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                variant={viewMode === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("edit")}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* Categories Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Menu Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.parsed_categories.map((category) => (
                  <Badge key={category} variant="outline" className="px-3 py-1">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {sampleMenuItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {!item.availability && (
                              <Badge variant="destructive" className="text-xs">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                            </div>
                            {item.variants && item.variants.length > 1 && (
                              <div className="text-xs text-gray-500">{item.variants.length} variants available</div>
                            )}
                          </div>
                          {item.dietary_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.dietary_tags.map((tag) => (
                                <Badge key={tag} className={`text-xs ${getDietaryTagColor(tag)}`}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {item.variants && item.variants.length > 1 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs font-medium text-gray-700 mb-2">Variants:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {item.variants.map((variant, index) => (
                                  <div key={index} className="flex justify-between text-xs">
                                    <span>{variant.name}</span>
                                    <span className="font-medium">${variant.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {viewMode === "edit" && (
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Pricing Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Price</span>
                    <span className="font-semibold">${formData.pricing_analysis.average_price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price Range</span>
                    <span className="font-semibold">
                      ${formData.pricing_analysis.price_range.min.toFixed(2)} - $
                      {formData.pricing_analysis.price_range.max.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Category Averages</h4>
                    {Object.entries(formData.pricing_analysis.category_averages).map(([category, avg]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{category}</span>
                        <span className="font-medium">${avg.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Menu Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Items</span>
                    <span className="font-semibold">{sampleMenuItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Categories</span>
                    <span className="font-semibold">{formData.parsed_categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vegetarian Options</span>
                    <span className="font-semibold">
                      {sampleMenuItems.filter((item) => item.dietary_tags.includes("Vegetarian")).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Popular Items</span>
                    <span className="font-semibold">
                      {sampleMenuItems.filter((item) => item.dietary_tags.includes("Popular")).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-800">Pricing Strategy</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your appetizer prices are competitive. Consider highlighting popular items.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-800">Menu Balance</p>
                    <p className="text-xs text-green-700 mt-1">
                      Good variety across categories. Strong vegetarian options available.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs font-medium text-yellow-800">Optimization</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Consider adding more gluten-free options to attract health-conscious diners.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* POS Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">POS Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <div className="text-2xl">🍞</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Toast POS</h4>
                    <p className="text-xs text-gray-600">Not connected</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <div className="text-2xl">⬜</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Square POS</h4>
                    <p className="text-xs text-gray-600">Not connected</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <div className="text-2xl">🥘</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Petpooja</h4>
                    <p className="text-xs text-gray-600">Not connected</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

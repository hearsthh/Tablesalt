"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Save,
  AlertTriangle,
  CheckCircle,
  Upload,
  Tag,
  ArrowRight,
  Store,
  ChefHat,
  Star,
  Users,
  Megaphone,
  Loader2,
  Database,
  Clock,
  Receipt,
  RefreshCw,
  ShoppingCart,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { RestaurantProfileForm } from "./restaurant-profile-form"

interface Field {
  id: string
  label: string
  value: string
  type: "text" | "textarea" | "number" | "select" | "file" | "switch"
  required: boolean
  options?: string[]
  placeholder?: string
  description?: string
  source?: "manual" | "integration" | "ai"
  integrationBrand?: string
}

interface Integration {
  id: string
  name: string
  logo: string
  status: "connected" | "disconnected" | "error"
  fields: string[]
  description: string
  category: string
  lastSync?: string
  dataCount?: number
  dataType?: string
}

interface SectionConfig {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  fields: Field[]
  integrations: Integration[]
}

interface SetupSectionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: string
}

export function SetupSectionDrawer({ open, onOpenChange, sectionId }: SetupSectionDrawerProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [fetchingData, setFetchingData] = useState(false)
  const [fetchProgress, setFetchProgress] = useState(0)

  // Memoize section configurations to prevent recreation
  const sectionConfigs = useMemo<Record<string, SectionConfig>>(
    () => ({
      "restaurant-info": {
        id: "restaurant-info",
        title: "Restaurant Profile",
        description: "Basic information about your restaurant",
        icon: Store,
        fields: [],
        integrations: [],
      },
      "menu-setup": {
        id: "menu-setup",
        title: "Menu Setup",
        description: "Configure your menu data and pricing",
        icon: ChefHat,
        fields: [
          {
            id: "input_method",
            label: "Input Method",
            value: "",
            type: "select",
            required: true,
            options: ["Upload", "Scan", "Manual", "Import"],
            placeholder: "Select how you want to add your menu",
            description: "Choose how you'd like to input your menu data",
            source: "manual",
          },
          {
            id: "raw_menu_text",
            label: "Menu Text",
            value: "",
            type: "textarea",
            required: false,
            placeholder: "Paste or type your menu content here...",
            description: "Raw text content of your menu",
            source: "manual",
          },
          {
            id: "parsed_categories",
            label: "Menu Categories",
            value: "Appetizers, Main Courses, Desserts, Beverages",
            type: "text",
            required: false,
            placeholder: "AI-extracted menu categories",
            description: "Categories automatically detected from your menu",
            source: "ai",
            integrationBrand: "AI Parser",
          },
          {
            id: "parsed_items",
            label: "Menu Items",
            value: "15 items parsed with prices and descriptions",
            type: "text",
            required: false,
            placeholder: "AI-extracted menu items",
            description: "Menu items with prices automatically detected",
            source: "ai",
            integrationBrand: "AI Parser",
          },
          {
            id: "pricing_analysis",
            label: "Pricing Analysis",
            value: "Average: $18.50, Range: $8.99-$32.99",
            type: "text",
            required: false,
            placeholder: "AI-generated pricing insights",
            description: "Pricing structure and analysis",
            source: "ai",
            integrationBrand: "AI Parser",
          },
          {
            id: "menu_status",
            label: "Processing Status",
            value: "Complete",
            type: "text",
            required: false,
            placeholder: "Menu processing status",
            description: "Current status of menu data processing",
            source: "ai",
            integrationBrand: "System",
          },
        ],
        integrations: [
          {
            id: "toast-pos",
            name: "Toast POS",
            logo: "🍞",
            status: "disconnected",
            fields: ["parsed_items", "pricing_analysis", "parsed_categories"],
            description: "Import menu items and pricing from Toast POS",
            category: "pos",
          },
          {
            id: "square-pos",
            name: "Square POS",
            logo: "⬜",
            status: "disconnected",
            fields: ["parsed_items", "pricing_analysis"],
            description: "Sync menu data from Square Point of Sale",
            category: "pos",
          },
          {
            id: "petpooja",
            name: "Petpooja",
            logo: "🥘",
            status: "disconnected",
            fields: ["parsed_items", "parsed_categories", "pricing_analysis"],
            description: "Connect with Petpooja restaurant management",
            category: "pos",
          },
          {
            id: "ai-parser",
            name: "AI Menu Parser",
            logo: "🤖",
            status: "connected",
            fields: ["parsed_categories", "parsed_items", "pricing_analysis"],
            description: "AI-powered menu text and image analysis",
            category: "ai",
          },
        ],
      },
      "reviews-setup": {
        id: "reviews-setup",
        title: "Reviews & Insights",
        description: "Customer feedback and review management settings",
        icon: Star,
        fields: [
          {
            id: "review_summary",
            label: "Review Data Summary",
            value: "1,247 reviews imported from 3 platforms",
            type: "text",
            required: false,
            description: "Total reviews imported across all connected platforms",
            source: "integration",
            integrationBrand: "Multiple Platforms",
          },
          {
            id: "average_rating",
            label: "Overall Average Rating",
            value: "4.3",
            type: "number",
            required: false,
            description: "Weighted average rating across all platforms",
            source: "integration",
            integrationBrand: "Calculated",
          },
          {
            id: "recent_reviews_count",
            label: "Recent Reviews (30 days)",
            value: "89",
            type: "number",
            required: false,
            description: "Number of reviews received in the last 30 days",
            source: "integration",
            integrationBrand: "Analytics",
          },
          {
            id: "response_rate",
            label: "Response Rate",
            value: "67",
            type: "number",
            required: false,
            description: "Percentage of reviews you've responded to",
            source: "integration",
            integrationBrand: "Analytics",
          },
          {
            id: "sentiment_analysis",
            label: "Sentiment Breakdown",
            value: "Positive: 78%, Neutral: 15%, Negative: 7%",
            type: "text",
            required: false,
            description: "AI-powered sentiment analysis of your reviews",
            source: "ai",
            integrationBrand: "AI Analytics",
          },
          {
            id: "common_keywords",
            label: "Common Keywords",
            value: "delicious, friendly service, cozy atmosphere, great value",
            type: "textarea",
            required: false,
            description: "Most frequently mentioned words in reviews",
            source: "ai",
            integrationBrand: "AI Analytics",
          },
        ],
        integrations: [
          {
            id: "google-reviews",
            name: "Google My Business",
            logo: "🔍",
            status: "connected",
            fields: ["review_summary", "average_rating", "recent_reviews_count"],
            description: "Import reviews from Google Business Profile",
            category: "reviews",
            lastSync: "2 hours ago",
            dataCount: 847,
            dataType: "reviews",
          },
          {
            id: "yelp-reviews",
            name: "Yelp Business",
            logo: "🍽️",
            status: "connected",
            fields: ["review_summary", "average_rating"],
            description: "Sync reviews from Yelp Business",
            category: "reviews",
            lastSync: "4 hours ago",
            dataCount: 312,
            dataType: "reviews",
          },
          {
            id: "zomato-reviews",
            name: "Zomato",
            logo: "🥘",
            status: "connected",
            fields: ["review_summary", "average_rating"],
            description: "Import reviews from Zomato",
            category: "reviews",
            lastSync: "6 hours ago",
            dataCount: 88,
            dataType: "reviews",
          },
          {
            id: "tripadvisor",
            name: "TripAdvisor",
            logo: "✈️",
            status: "disconnected",
            fields: ["review_summary", "average_rating"],
            description: "Connect TripAdvisor reviews",
            category: "reviews",
          },
        ],
      },
      "pos-integration": {
        id: "pos-integration",
        title: "POS Integration",
        description: "Point of sale system connection and order data",
        icon: Receipt,
        fields: [
          {
            id: "orders_summary",
            label: "Orders Data Summary",
            value: "12,847 orders imported from 2 POS systems",
            type: "text",
            required: false,
            description: "Total orders imported from connected POS systems",
            source: "integration",
            integrationBrand: "POS Systems",
          },
          {
            id: "date_range",
            label: "Data Date Range",
            value: "Jan 1, 2023 - Present",
            type: "text",
            required: false,
            description: "Date range of imported order data",
            source: "integration",
            integrationBrand: "System",
          },
          {
            id: "total_revenue",
            label: "Total Revenue",
            value: "$284,750",
            type: "text",
            required: false,
            description: "Total revenue from imported orders",
            source: "integration",
            integrationBrand: "Calculated",
          },
          {
            id: "average_order_value",
            label: "Average Order Value",
            value: "$22.15",
            type: "text",
            required: false,
            description: "Average value per order",
            source: "integration",
            integrationBrand: "Calculated",
          },
          {
            id: "order_types_breakdown",
            label: "Order Types Breakdown",
            value: "Dine-in: 45%, Takeaway: 35%, Delivery: 20%",
            type: "text",
            required: false,
            description: "Distribution of order types",
            source: "integration",
            integrationBrand: "Analytics",
          },
          {
            id: "peak_hours",
            label: "Peak Hours Analysis",
            value: "Lunch: 12-2 PM, Dinner: 7-9 PM",
            type: "text",
            required: false,
            description: "Busiest hours based on order data",
            source: "ai",
            integrationBrand: "AI Analytics",
          },
          {
            id: "top_selling_items",
            label: "Top Selling Items",
            value: "1. Margherita Pizza (247 orders), 2. Caesar Salad (189 orders), 3. Chicken Parmigiana (156 orders)",
            type: "textarea",
            required: false,
            description: "Most popular menu items based on order frequency",
            source: "ai",
            integrationBrand: "AI Analytics",
          },
          {
            id: "payment_methods_breakdown",
            label: "Payment Methods",
            value: "Credit Card: 65%, Mobile Payment: 25%, Cash: 10%",
            type: "text",
            required: false,
            description: "Distribution of payment methods used",
            source: "integration",
            integrationBrand: "Analytics",
          },
        ],
        integrations: [
          {
            id: "square-pos-orders",
            name: "Square POS",
            logo: "⬜",
            status: "connected",
            fields: ["orders_summary", "total_revenue", "average_order_value"],
            description: "Import order history from Square POS",
            category: "pos",
            lastSync: "1 hour ago",
            dataCount: 8247,
            dataType: "orders",
          },
          {
            id: "toast-pos-orders",
            name: "Toast POS",
            logo: "🍞",
            status: "connected",
            fields: ["orders_summary", "order_types_breakdown"],
            description: "Sync order data from Toast POS",
            category: "pos",
            lastSync: "3 hours ago",
            dataCount: 4600,
            dataType: "orders",
          },
          {
            id: "petpooja-orders",
            name: "Petpooja",
            logo: "🥘",
            status: "disconnected",
            fields: ["orders_summary", "order_types_breakdown"],
            description: "Connect Petpooja order management",
            category: "pos",
          },
          {
            id: "resy-pos",
            name: "Resy POS",
            logo: "📋",
            status: "disconnected",
            fields: ["orders_summary", "peak_hours"],
            description: "Import reservation and order data from Resy",
            category: "pos",
          },
        ],
      },
      "delivery-platforms": {
        id: "delivery-platforms",
        title: "Delivery Platforms",
        description: "Food delivery services integration",
        icon: ShoppingCart,
        fields: [
          {
            id: "delivery_orders_summary",
            label: "Delivery Orders Summary",
            value: "3,247 delivery orders from 3 platforms",
            type: "text",
            required: false,
            description: "Total delivery orders across all platforms",
            source: "integration",
            integrationBrand: "Delivery Platforms",
          },
          {
            id: "delivery_revenue",
            label: "Delivery Revenue",
            value: "$67,890",
            type: "text",
            required: false,
            description: "Total revenue from delivery orders",
            source: "integration",
            integrationBrand: "Calculated",
          },
          {
            id: "average_delivery_time",
            label: "Average Delivery Time",
            value: "32 minutes",
            type: "text",
            required: false,
            description: "Average time from order to delivery",
            source: "integration",
            integrationBrand: "Analytics",
          },
          {
            id: "delivery_rating",
            label: "Average Delivery Rating",
            value: "4.6",
            type: "text",
            required: false,
            description: "Average customer rating for delivery orders",
            source: "integration",
            integrationBrand: "Platforms",
          },
        ],
        integrations: [
          {
            id: "uber-eats-orders",
            name: "Uber Eats",
            logo: "🚗",
            status: "connected",
            fields: ["delivery_orders_summary", "delivery_revenue"],
            description: "Import delivery orders from Uber Eats",
            category: "delivery",
            lastSync: "2 hours ago",
            dataCount: 1847,
            dataType: "delivery orders",
          },
          {
            id: "doordash-orders",
            name: "DoorDash",
            logo: "🚪",
            status: "connected",
            fields: ["delivery_orders_summary", "average_delivery_time"],
            description: "Sync delivery orders from DoorDash",
            category: "delivery",
            lastSync: "1 hour ago",
            dataCount: 1400,
            dataType: "delivery orders",
          },
          {
            id: "grubhub-orders",
            name: "Grubhub",
            logo: "🍔",
            status: "disconnected",
            fields: ["delivery_orders_summary", "delivery_rating"],
            description: "Connect Grubhub delivery orders",
            category: "delivery",
          },
        ],
      },
      "customer-data": {
        id: "customer-data",
        title: "Customer Data",
        description: "Customer profiles, segments, and loyalty programs",
        icon: Users,
        fields: [
          {
            id: "total_customers",
            label: "Total Registered Customers",
            value: "1,250",
            type: "number",
            required: false,
            placeholder: "1000",
            description: "Number of customers in your database",
            source: "integration",
            integrationBrand: "HubSpot",
          },
          {
            id: "customer_segments",
            label: "Customer Segments",
            value: "Regular Diners, Special Occasion, Takeout Only",
            type: "textarea",
            required: true,
            placeholder: "Describe your main customer groups",
            description: "How do you categorize your customers?",
            source: "integration",
            integrationBrand: "Mailchimp",
          },
          {
            id: "loyalty_program",
            label: "Loyalty Program",
            value: true,
            type: "switch",
            required: false,
            description: "Do you have a customer loyalty program?",
          },
          {
            id: "loyalty_program_name",
            label: "Loyalty Program Name",
            value: "Bella Rewards",
            type: "text",
            required: false,
            placeholder: "VIP Club, Rewards Program, etc.",
            description: "Name of your loyalty program (if applicable)",
          },
          {
            id: "average_customer_visits",
            label: "Average Monthly Visits per Customer",
            value: "3",
            type: "number",
            required: false,
            placeholder: "2",
            description: "How often does a typical customer visit?",
          },
          {
            id: "customer_acquisition_channels",
            label: "Customer Acquisition Channels",
            value: "Word of mouth, Social media, Walk-ins",
            type: "textarea",
            required: true,
            placeholder: "How do new customers discover you?",
            description: "Main ways customers find your restaurant",
          },
        ],
        integrations: [
          {
            id: "hubspot",
            name: "HubSpot CRM",
            logo: "🎯",
            status: "connected",
            fields: ["total_customers", "customer_segments"],
            description: "Import customer data from HubSpot",
            category: "crm",
          },
          {
            id: "mailchimp",
            name: "Mailchimp",
            logo: "📧",
            status: "disconnected",
            fields: ["total_customers", "customer_segments"],
            description: "Sync customer lists from Mailchimp",
            category: "marketing",
          },
        ],
      },
      reservations: {
        id: "reservations",
        title: "Reservations",
        description: "Table booking systems",
        icon: Calendar,
        fields: [
          {
            id: "total_reservations",
            label: "Total Reservations",
            value: "2,847",
            type: "text",
            required: false,
            description: "Total reservations across all platforms",
            source: "integration",
            integrationBrand: "Reservation Systems",
          },
          {
            id: "reservation_conversion_rate",
            label: "Conversion Rate",
            value: "87%",
            type: "text",
            required: false,
            description: "Percentage of reservations that were honored",
            source: "integration",
            integrationBrand: "Analytics",
          },
          {
            id: "average_party_size",
            label: "Average Party Size",
            value: "3.2 people",
            type: "text",
            required: false,
            description: "Average number of guests per reservation",
            source: "integration",
            integrationBrand: "Analytics",
          },
          {
            id: "peak_reservation_times",
            label: "Peak Reservation Times",
            value: "Friday-Saturday 7-9 PM",
            type: "text",
            required: false,
            description: "Most popular reservation times",
            source: "ai",
            integrationBrand: "AI Analytics",
          },
        ],
        integrations: [
          {
            id: "opentable",
            name: "OpenTable",
            logo: "📅",
            status: "connected",
            fields: ["total_reservations", "reservation_conversion_rate"],
            description: "Connect with OpenTable reservation system",
            category: "reservations",
            lastSync: "30 minutes ago",
            dataCount: 2847,
            dataType: "reservations",
          },
          {
            id: "resy",
            name: "Resy",
            logo: "📋",
            status: "disconnected",
            fields: ["total_reservations", "average_party_size"],
            description: "Import reservations from Resy",
            category: "reservations",
          },
        ],
      },
      "channel-integrations": {
        id: "channel-integrations",
        title: "Marketing Campaigns",
        description: "Marketing goals, campaigns, and promotional strategies",
        icon: Megaphone,
        fields: [
          {
            id: "marketing_goals",
            label: "Primary Marketing Goals",
            value: "Increase weekend traffic, Promote new menu items",
            type: "textarea",
            required: true,
            placeholder: "What are your main marketing objectives?",
            description: "Your top 2-3 marketing priorities",
          },
          {
            id: "target_audience",
            label: "Target Audience",
            value: "Families, Young professionals, Food enthusiasts",
            type: "textarea",
            required: true,
            placeholder: "Describe your ideal customers",
            description: "Who are you trying to reach with marketing?",
            source: "integration",
            integrationBrand: "Instagram",
          },
          {
            id: "marketing_budget",
            label: "Monthly Marketing Budget",
            value: "500",
            type: "number",
            required: false,
            placeholder: "300",
            description: "Monthly budget for marketing activities (USD)",
            source: "integration",
            integrationBrand: "Facebook",
          },
          {
            id: "preferred_channels",
            label: "Preferred Marketing Channels",
            value: "Social media, Email, Local advertising",
            type: "textarea",
            required: true,
            placeholder: "Which channels work best for you?",
            description: "Your most effective marketing channels",
          },
          {
            id: "promotional_frequency",
            label: "Promotional Campaign Frequency",
            value: "Weekly",
            type: "select",
            required: true,
            options: ["Daily", "Weekly", "Bi-weekly", "Monthly", "Seasonal"],
            description: "How often do you run promotions?",
          },
          {
            id: "brand_voice",
            label: "Brand Voice & Tone",
            value: "Friendly, Authentic, Family-oriented",
            type: "text",
            required: true,
            placeholder: "e.g., Professional, Casual, Fun, Elegant",
            description: "How should your brand communicate?",
          },
        ],
        integrations: [
          {
            id: "instagram",
            name: "Instagram Business",
            logo: "📸",
            status: "connected",
            fields: ["target_audience", "brand_voice"],
            description: "Connect Instagram for social marketing",
            category: "marketing",
          },
          {
            id: "facebook",
            name: "Facebook Business",
            logo: "📘",
            status: "disconnected",
            fields: ["target_audience", "marketing_budget"],
            description: "Sync Facebook business page",
            category: "marketing",
          },
        ],
      },
    }),
    [],
  )

  // Add error handling for undefined sectionId
  const currentSection = sectionId ? sectionConfigs[sectionId] : null

  // Initialize form data when section changes
  useEffect(() => {
    if (currentSection) {
      const initialData: Record<string, any> = {}
      currentSection.fields.forEach((field) => {
        initialData[field.id] = field.value
      })
      setFormData(initialData)
      setHasChanges(false)
    }
  }, [currentSection])

  // Memoize field change handler to prevent recreation
  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
    setHasChanges(true)
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, save to Supabase here
      console.log("Saving data:", formData)

      setHasChanges(false)

      // Show success message (you'll need to add toast provider)
      console.log(`${currentSection?.title} has been updated successfully.`)
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setSaving(false)
    }
  }, [formData, currentSection?.title])

  const handleConnectIntegration = useCallback((integration: Integration) => {
    setSelectedIntegration(integration)
    // Pre-select all fields by default
    setSelectedFields(integration.fields)
    setConnectModalOpen(true)
  }, [])

  const handleFieldSelection = useCallback((fieldId: string, checked: boolean) => {
    setSelectedFields((prev) => (checked ? [...prev, fieldId] : prev.filter((id) => id !== fieldId)))
  }, [])

  const handleImportData = useCallback(async () => {
    if (!selectedIntegration || selectedFields.length === 0) return

    setFetchingData(true)
    setFetchProgress(0)

    try {
      // Simulate data fetching with progress
      for (let i = 0; i <= 100; i += 10) {
        setFetchProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // Update form data with fetched data for selected fields
      selectedFields.forEach((fieldId) => {
        const field = currentSection?.fields.find((f) => f.id === fieldId)
        if (field) {
          const mockValue = `Auto-fetched ${field.label.toLowerCase()} from ${selectedIntegration.name}`
          handleFieldChange(fieldId, mockValue)
        }
      })

      // Update integration status
      const updatedIntegration = currentSection?.integrations.find((i) => i.id === selectedIntegration.id)
      if (updatedIntegration) {
        updatedIntegration.status = "connected"
      }

      setConnectModalOpen(false)
      setSelectedIntegration(null)
      setSelectedFields([])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setFetchingData(false)
      setFetchProgress(0)
    }
  }, [selectedIntegration, selectedFields, currentSection, handleFieldChange])

  // Memoize status calculations
  const { fieldsStatus, integrationsStatus } = useMemo(() => {
    if (!currentSection) {
      return {
        fieldsStatus: { total: 0, filled: 0, requiredTotal: 0, requiredFilled: 0 },
        integrationsStatus: { total: 0, connected: 0 },
      }
    }

    const requiredFields = currentSection.fields.filter((f) => f.required)
    const filledRequiredFields = requiredFields.filter((f) => {
      const value = formData[f.id]
      return value !== undefined && value !== null && value !== "" && value !== false
    })

    const fieldsStatus = {
      total: currentSection.fields.length,
      filled: currentSection.fields.filter((f) => {
        const value = formData[f.id]
        return value !== undefined && value !== null && value !== "" && value !== false
      }).length,
      requiredTotal: requiredFields.length,
      requiredFilled: filledRequiredFields.length,
    }

    const integrationsStatus = {
      total: currentSection.integrations.length,
      connected: currentSection.integrations.filter((i) => i.status === "connected").length,
    }

    return { fieldsStatus, integrationsStatus }
  }, [currentSection, formData])

  const getSourceBadge = useCallback((field: Field) => {
    if (!field.source || !field.integrationBrand) return null

    const sourceConfig = {
      manual: { color: "bg-gray-100 text-gray-700" },
      integration: { color: "bg-blue-100 text-blue-700" },
      ai: { color: "bg-purple-100 text-purple-700" },
    }

    const config = sourceConfig[field.source as keyof typeof sourceConfig]
    if (!config) return null

    return <Badge className={`text-xs px-2 py-0.5 ${config.color}`}>{field.integrationBrand}</Badge>
  }, [])

  // Return null if no section is found
  if (!currentSection) {
    return null
  }

  const IconComponent = currentSection.icon

  // Special handling for restaurant-info section
  if (sectionId === "restaurant-info") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] p-0 flex flex-col">
          {/* Fixed Header */}
          <SheetHeader className="flex-shrink-0 p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base flex items-center space-x-2">
                <IconComponent className="h-5 w-5" />
                <span>{currentSection.title}</span>
              </SheetTitle>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    Unsaved
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <RestaurantProfileForm
              onSave={async (data) => {
                setSaving(true)
                try {
                  // Simulate API call
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  console.log("Saving restaurant profile:", data)
                  setHasChanges(false)
                } catch (error) {
                  console.error("Error saving:", error)
                } finally {
                  setSaving(false)
                }
              }}
              saving={saving}
            />
          </div>

          {/* Fixed Bottom Actions */}
          <div className="flex-shrink-0 p-4 bg-white border-t">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10 text-sm">
                Close
              </Button>
              <Link href={`/setup/${sectionId}`} className="flex-1">
                <Button className="w-full h-10 text-sm bg-black text-white hover:bg-gray-800">
                  Go to Full Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Default handling for other sections
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95vh] p-0 flex flex-col">
        {/* Fixed Header */}
        <SheetHeader className="flex-shrink-0 p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base flex items-center space-x-2">
              <IconComponent className="h-5 w-5" />
              <span>{currentSection.title}</span>
            </SheetTitle>
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  Unsaved
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                size="sm"
                className="h-8 px-3 bg-black text-white hover:bg-gray-800 text-xs"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Status Overview */}
        <div className="flex-shrink-0 p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-medium text-sm">Completion Status</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <p className="text-xs text-gray-600">
                  {fieldsStatus.filled} of {fieldsStatus.total} fields completed
                  {fieldsStatus.requiredTotal > 0 && (
                    <span className="ml-2">
                      • {fieldsStatus.requiredFilled}/{fieldsStatus.requiredTotal} required
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600">
                  {integrationsStatus.connected} of {integrationsStatus.total} integrations connected
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {fieldsStatus.requiredFilled === fieldsStatus.requiredTotal ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <Badge
                variant={fieldsStatus.requiredFilled === fieldsStatus.requiredTotal ? "default" : "secondary"}
                className="text-xs"
              >
                {fieldsStatus.requiredFilled === fieldsStatus.requiredTotal ? "Complete" : "Incomplete"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs Container - This should take remaining space and handle scrolling */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            {/* Fixed Tabs List */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
              <TabsList className="grid w-full grid-cols-2 h-10">
                <TabsTrigger value="fields" className="text-sm font-medium">
                  Data Summary
                </TabsTrigger>
                <TabsTrigger value="integrations" className="text-sm font-medium">
                  Integrations
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Scrollable Tab Content */}
            <TabsContent value="fields" className="flex-1 overflow-y-auto px-4 pb-4 mt-0 data-[state=inactive]:hidden">
              <Card className="ai-card">
                <CardContent className="space-y-6 p-4">
                  {currentSection.fields.map((field) => {
                    const value = formData[field.id] ?? field.value
                    const isEmpty = !value || value === ""
                    const isRequired = field.required

                    return (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={field.id} className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{field.label}</span>
                            {isRequired && <span className="text-red-500">*</span>}
                            {getSourceBadge(field)}
                          </Label>
                          {isEmpty && isRequired && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-red-600">Required</span>
                            </div>
                          )}
                        </div>

                        {field.type === "text" && (
                          <Input
                            id={field.id}
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className={`h-11 ${isEmpty && isRequired ? "border-red-300" : ""}`}
                            readOnly={field.source === "integration" || field.source === "ai"}
                          />
                        )}

                        {field.type === "textarea" && (
                          <Textarea
                            id={field.id}
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className={`min-h-[100px] resize-none ${isEmpty && isRequired ? "border-red-300" : ""}`}
                            readOnly={field.source === "integration" || field.source === "ai"}
                          />
                        )}

                        {field.type === "number" && (
                          <Input
                            id={field.id}
                            type="number"
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className={`h-11 ${isEmpty && isRequired ? "border-red-300" : ""}`}
                            readOnly={field.source === "integration" || field.source === "ai"}
                          />
                        )}

                        {field.type === "select" && (
                          <Select value={value} onValueChange={(newValue) => handleFieldChange(field.id, newValue)}>
                            <SelectTrigger className={`h-11 ${isEmpty && isRequired ? "border-red-300" : ""}`}>
                              <SelectValue placeholder={field.placeholder || "Select an option"} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {field.type === "switch" && (
                          <div className="flex items-center space-x-3 py-2">
                            <Switch
                              id={field.id}
                              checked={value}
                              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                            />
                            <Label htmlFor={field.id} className="text-sm">
                              {value ? "Enabled" : "Disabled"}
                            </Label>
                          </div>
                        )}

                        {field.type === "file" && (
                          <div className="space-y-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                              <Input
                                id={field.id}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleFieldChange(field.id, file.name)
                                  }
                                }}
                              />
                            </div>
                            {value && <p className="text-xs text-gray-600">Current file: {value}</p>}
                          </div>
                        )}

                        {field.description && <p className="text-xs text-gray-500 mt-1">{field.description}</p>}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="integrations"
              className="flex-1 overflow-y-auto px-4 pb-4 mt-0 data-[state=inactive]:hidden"
            >
              <Card className="ai-card">
                <CardContent className="space-y-4 p-4">
                  {currentSection.integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{integration.logo}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{integration.name}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{integration.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500 capitalize">{integration.category}</span>
                          </div>

                          {/* Data Summary for Connected Integrations */}
                          {integration.status === "connected" && integration.dataCount && (
                            <div className="mt-2 p-2 bg-green-50 rounded-md">
                              <div className="flex items-center space-x-2 mb-1">
                                <Database className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium text-green-800">
                                  {integration.dataCount.toLocaleString()} {integration.dataType} imported
                                </span>
                              </div>
                              {integration.lastSync && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 text-green-600" />
                                  <span className="text-xs text-green-700">Last sync: {integration.lastSync}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <Badge
                          variant={integration.status === "connected" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {integration.status === "connected" ? "Connected" : "Not Connected"}
                        </Badge>
                        <Button
                          size="sm"
                          variant={integration.status === "connected" ? "outline" : "default"}
                          onClick={() => handleConnectIntegration(integration)}
                          className="h-8 px-3 text-xs"
                        >
                          {integration.status === "connected" ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Re-sync
                            </>
                          ) : (
                            "Connect"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Manual Setup Option */}
                  <div className="border-t pt-4 mt-6">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm bg-transparent"
                      onClick={() => setActiveTab("fields")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      View Data Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="flex-shrink-0 p-4 bg-white border-t">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10 text-sm">
              Close
            </Button>
            <Link href={`/setup/${sectionId}`} className="flex-1">
              <Button className="w-full h-10 text-sm bg-black text-white hover:bg-gray-800">
                Go to Full Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>

      {/* Integration Connect Modal with Field Selection */}
      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span className="text-2xl">{selectedIntegration?.logo}</span>
              <span>Connect {selectedIntegration?.name}</span>
            </DialogTitle>
          </DialogHeader>

          {fetchingData ? (
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Fetching data from {selectedIntegration?.name}...</p>
                <p className="text-xs text-gray-600">Please wait while we import your data</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{fetchProgress}%</span>
                </div>
                <Progress value={fetchProgress} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select the data you want to import from {selectedIntegration?.name}:
              </p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedIntegration?.fields.map((fieldId) => {
                  const field = currentSection.fields.find((f) => f.id === fieldId)
                  if (!field) return null

                  return (
                    <div key={fieldId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Checkbox
                        id={fieldId}
                        checked={selectedFields.includes(fieldId)}
                        onCheckedChange={(checked) => handleFieldSelection(fieldId, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={fieldId} className="font-medium text-sm cursor-pointer">
                          {field.label}
                        </Label>
                        {field.description && <p className="text-xs text-gray-600 mt-1">{field.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setConnectModalOpen(false)} className="flex-1 h-9 text-sm">
                  Cancel
                </Button>
                <Button
                  onClick={handleImportData}
                  disabled={selectedFields.length === 0}
                  className="flex-1 h-9 text-sm bg-black text-white hover:bg-gray-800"
                >
                  Import Data ({selectedFields.length})
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}

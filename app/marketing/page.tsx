"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  FileText,
  Target,
  TrendingUp,
  Eye,
  DollarSign,
  Mail,
  Instagram,
  Facebook,
  Smartphone,
  Globe,
  MessageSquare,
  Sparkles,
  Calendar,
  ChefHat,
  Star,
  Heart,
  Camera,
  Gift,
  Users,
  MapPin,
  Upload,
  Play,
  Crop,
  Type,
  Music,
  Palette,
  Megaphone,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"
import { CalendarView } from "@/components/calendar-view" // Import CalendarView component

const CHANNELS = {
  Instagram: {
    icon: Instagram,
    types: ["Post", "Story", "Reel", "Carousel"],
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
  Facebook: {
    icon: Facebook,
    types: ["Post", "Video", "Event", "Story"],
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  WhatsApp: {
    icon: MessageSquare,
    types: ["Message", "Status", "Broadcast"],
    color: "bg-green-50 text-green-600 border-green-200",
  },
  Email: {
    icon: Mail,
    types: ["Newsletter", "Promotion", "Welcome"],
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  SMS: { icon: Smartphone, types: ["Promotion", "Reminder", "Alert"], color: "bg-red-50 text-red-600 border-red-200" },
  Yelp: { icon: Globe, types: ["Update", "Photo", "Event"], color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  Zomato: { icon: Globe, types: ["Menu Update", "Photo", "Offer"], color: "bg-gray-50 text-gray-700 border-gray-200" },
}

const CONTENT_TYPES = [
  { id: "menu-highlight", name: "Menu Highlight", icon: ChefHat },
  { id: "item-highlight", name: "Item Highlight", icon: Star },
  { id: "category-highlight", name: "Category Highlight", icon: Target },
  { id: "offer-card", name: "Offer Card", icon: Gift },
  { id: "behind-scenes", name: "Behind the Scenes", icon: Camera },
  { id: "chef-special", name: "Chef Special", icon: ChefHat },
  { id: "testimonial", name: "Testimonial Card", icon: Heart },
  { id: "review-card", name: "Customer Review Card", icon: Star },
  { id: "sorry-card", name: "Sorry Card", icon: MessageSquare },
  { id: "thank-you", name: "Thank You Card", icon: Heart },
  { id: "event-promo", name: "Event Promotion", icon: Calendar },
  { id: "seasonal", name: "Seasonal Content", icon: Sparkles },
  { id: "location", name: "Location Highlight", icon: MapPin },
  { id: "team", name: "Team Spotlight", icon: Users },
]

export default function MarketingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState("August")
  const [currentYear, setCurrentYear] = useState("2025")
  const [activeTab, setActiveTab] = useState("strategies")
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const [showMediaUpload, setShowMediaUpload] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [processingFiles, setProcessingFiles] = useState<string[]>([])
  const [enhancedContent, setEnhancedContent] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [showEnhancementDialog, setShowEnhancementDialog] = useState(false)
  const [showCalendarView, setShowCalendarView] = useState(false)

  const [selectedChannel, setSelectedChannel] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedContent, setSelectedContent] = useState("")
  const [activityTitle, setActivityTitle] = useState("")
  const [activityDescription, setActivityDescription] = useState("")
  const [generatingActivity, setGeneratingActivity] = useState(false)

  const [loading, setLoading] = useState(true)
  const [marketingData, setMarketingData] = useState<any>(null)
  const [strategies, setStrategies] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  const [showStrategyDialog, setShowStrategyDialog] = useState(false)
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)

  useEffect(() => {
    const loadMarketingData = async () => {
      try {
        setLoading(true)

        const mockStrategies = [
          {
            id: 1,
            name: "Weekend Dining Boost",
            description: "Increase weekend foot traffic through targeted promotions",
            target: "25% increase in weekend revenue",
            status: "active",
            progress: 78,
            campaigns: 3,
            roi: "320%",
            budget: 5000,
            spent: 3200,
          },
          {
            id: 2,
            name: "Social Media Growth",
            description: "Expand social media presence and engagement",
            target: "50% follower growth",
            status: "active",
            progress: 65,
            campaigns: 2,
            roi: "280%",
            budget: 3000,
            spent: 1800,
          },
        ]

        const mockCampaigns = [
          {
            id: 1,
            name: "Weekend Pasta Special",
            strategyId: 1,
            status: "active",
            type: "Promotion",
            budget: 2000,
            spent: 1200,
            reach: 15420,
            engagement: 892,
            conversions: 45,
          },
          {
            id: 2,
            name: "Instagram Growth Campaign",
            strategyId: 2,
            status: "active",
            type: "Social Media",
            budget: 1500,
            spent: 900,
            reach: 8750,
            engagement: 1240,
            conversions: 32,
          },
        ]

        const mockActivities = [
          {
            id: 1,
            title: "Weekend Special Pasta",
            channel: "Instagram",
            type: "Post",
            content: "menu-highlight",
            status: "published",
            scheduledDate: "2024-01-15",
            metrics: { reach: 1247, engagement: 156, clicks: 23 },
            campaignId: 1,
          },
          {
            id: 2,
            title: "Chef's Special Video",
            channel: "Facebook",
            type: "Video",
            content: "chef-special",
            status: "scheduled",
            scheduledDate: "2024-01-20",
            metrics: { reach: 0, engagement: 0, clicks: 0 },
            campaignId: 2,
          },
        ]

        setStrategies(mockStrategies)
        setCampaigns(mockCampaigns)
        setActivities(mockActivities)
        setMarketingData({ totalReach: 24170, totalEngagement: 2132 })

        toast({
          title: "Marketing Data Loaded",
          description: `Loaded ${mockCampaigns.length} campaigns and ${mockStrategies.length} strategies.`,
        })
      } catch (error) {
        console.error("Failed to load marketing data:", error)
        toast({
          title: "Loading Error",
          description: "Using fallback data. Check your connection.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMarketingData()
  }, [toast])

  const navigateToStrategy = (id: number) => {
    router.push(`/marketing/strategies/${id}`)
  }

  const navigateToCampaign = (id: number) => {
    router.push(`/marketing/campaigns/${id}`)
  }

  const navigateToActivity = (id: number) => {
    router.push(`/marketing/activities/${id}`)
  }

  const navigateToChannel = (channel: string) => {
    router.push(`/marketing/channels/${channel.toLowerCase()}`)
  }

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      category: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
      uploadedAt: new Date().toISOString(),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully.`,
    })
  }

  const categorizeFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      return "photo"
    } else if (file.type.startsWith("video/")) {
      return "video"
    } else if (file.type.startsWith("audio/")) {
      return "audio"
    }
    return "document"
  }

  const processFileWithAI = async (file: any) => {
    setProcessingFiles((prev) => [...prev, file.id])

    // Simulate AI processing
    setTimeout(() => {
      const aiAnalysis = {
        description: generateAIDescription(file),
        suggestedCaptions: generateCaptions(file),
        hashtags: generateHashtags(file),
        contentTypes: suggestContentTypes(file),
        platforms: suggestPlatforms(file),
        enhancements: suggestEnhancements(file),
      }

      setUploadedFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, aiAnalysis } : f)))
      setProcessingFiles((prev) => prev.filter((id) => id !== file.id))

      toast({
        title: "AI Analysis Complete",
        description: `${file.name} has been analyzed and enhanced.`,
      })
    }, 2000)
  }

  const generateAIDescription = (file: any) => {
    const descriptions = {
      photo: "High-quality food photography showing vibrant colors and appetizing presentation",
      video: "Dynamic cooking video with professional lighting and engaging visual flow",
      audio: "Clear audio content suitable for background music or voice-over",
    }
    return descriptions[file.category as keyof typeof descriptions] || "Content ready for enhancement"
  }

  const generateCaptions = (file: any) => {
    const captions = {
      photo: [
        "Fresh ingredients, bold flavors! 🍝 What's your favorite pasta dish?",
        "Crafted with love in our kitchen. Taste the difference! ✨",
        "Every bite tells a story. What's yours? #FreshFlavors",
      ],
      video: [
        "Watch our chef create magic! Behind the scenes at Bella Vista 👨‍🍳",
        "From kitchen to table - see how we make your favorites! 🔥",
        "The art of cooking, one dish at a time ✨",
      ],
    }
    return captions[file.category as keyof typeof captions] || ["Great content deserves great captions!"]
  }

  const generateHashtags = (file: any) => {
    return ["#BellaVista", "#ItalianCuisine", "#FreshIngredients", "#Foodie", "#Restaurant", "#Delicious"]
  }

  const suggestContentTypes = (file: any) => {
    if (file.category === "photo") {
      return ["Menu Highlight", "Dish Showcase", "Behind the Scenes", "Customer Experience"]
    } else if (file.category === "video") {
      return ["Chef Special", "Cooking Process", "Restaurant Tour", "Customer Testimonial"]
    }
    return ["Social Post", "Story Content"]
  }

  const suggestPlatforms = (file: any) => {
    if (file.category === "video") {
      return ["Instagram", "Facebook", "TikTok", "YouTube"]
    }
    return ["Instagram", "Facebook", "WhatsApp"]
  }

  const suggestEnhancements = (file: any) => {
    if (file.category === "photo") {
      return [
        { type: "crop", label: "Auto-crop for different platforms", icon: Crop },
        { type: "text", label: "Add branded text overlay", icon: Type },
        { type: "filter", label: "Apply restaurant brand colors", icon: Palette },
      ]
    } else if (file.category === "video") {
      return [
        { type: "trim", label: "Create short clips for reels", icon: Play },
        { type: "music", label: "Add trending background music", icon: Music },
        { type: "captions", label: "Generate auto-captions", icon: Type },
      ]
    }
    return []
  }

  const enhanceFileForPlatform = (file: any, platform: string, contentType: string) => {
    setSelectedFile(file)
    setShowEnhancementDialog(true)

    // Simulate enhancement process
    setTimeout(() => {
      const enhanced = {
        id: Date.now(),
        originalFile: file,
        platform,
        contentType,
        variations: generateVariations(file, platform),
        readyToPublish: true,
        createdAt: new Date(),
      }

      setEnhancedContent((prev) => [...prev, enhanced])
      setShowEnhancementDialog(false)

      toast({
        title: "Content Enhanced!",
        description: `${file.name} has been optimized for ${platform}.`,
      })
    }, 1500)
  }

  const generateVariations = (file: any, platform: string) => {
    const variations = {
      Instagram: [
        { type: "Post", size: "1080x1080", optimized: true },
        { type: "Story", size: "1080x1920", optimized: true },
        { type: "Reel", size: "1080x1920", optimized: true },
      ],
      Facebook: [
        { type: "Post", size: "1200x630", optimized: true },
        { type: "Story", size: "1080x1920", optimized: true },
      ],
    }
    return variations[platform as keyof typeof variations] || []
  }

  const handleNewClick = () => {
    setShowNewDialog(true)
  }

  const handleNewStrategy = () => {
    setShowNewDialog(false)
    setShowStrategyDialog(true)
  }

  const handleNewCampaign = () => {
    setShowNewDialog(false)
    setShowCampaignDialog(true)
  }

  const handleCalendarToggle = () => {
    setShowCalendarView(!showCalendarView)
  }

  const handleMediaUpload = () => {
    setShowMediaUpload(true)
  }

  const generateActivity = async () => {
    if (!selectedChannel || !selectedType || !selectedContent || !activityTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setGeneratingActivity(true)

    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newActivity = {
        id: Date.now(),
        title: activityTitle,
        channel: selectedChannel,
        type: selectedType,
        content: selectedContent,
        status: "draft",
        scheduledDate: new Date().toISOString().split("T")[0],
        metrics: { reach: 0, engagement: 0, clicks: 0 },
        campaignId: null,
      }

      setActivities((prev) => [newActivity, ...prev])
      setShowActivityDialog(false)

      // Reset form
      setSelectedChannel("")
      setSelectedType("")
      setSelectedContent("")
      setActivityTitle("")
      setActivityDescription("")

      toast({
        title: "Activity Generated",
        description: "AI has created your marketing activity with optimized content.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingActivity(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationDrawer />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading marketing hub...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <NavigationDrawer />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Marketing Hub</h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Manage strategies, campaigns, channels, and activities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCalendarToggle}
              className="border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md border hover:bg-gray-50 flex items-center space-x-1"
            >
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">{showCalendarView ? "List View" : "Calendar"}</span>
            </button>
            <button
              onClick={handleMediaUpload}
              className="border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md border hover:bg-gray-50 flex items-center space-x-1"
            >
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">Upload Media</span>
            </button>
            <button
              onClick={handleNewClick}
              className="bg-gray-900 text-white hover:bg-gray-700 h-8 px-3 text-xs rounded-md flex items-center space-x-1"
            >
              <Plus className="h-3 w-3" />
              <span>New</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">AI Marketing Features Active</span>
          </div>
          <p className="text-xs text-blue-700">
            Try the AI Marketing Content Generator - click "AI Generate" to create personalized campaigns and content.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-100 bg-white rounded-lg">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-500 truncate">Total Reach</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-semibold text-gray-900">24,170</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 bg-white rounded-lg">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-500 truncate">Engagement</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-semibold text-gray-900">2,132</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 bg-white rounded-lg">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-500 truncate">Active Campaigns</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-semibold text-gray-900">2</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 bg-white rounded-lg">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-500 truncate">ROI</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-semibold text-gray-900">320%</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto scrollbar-hide px-6">
              <div className="flex space-x-6 min-w-max">
                {["strategies", "campaigns", "channels", "activities", "ai-generator"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab === "ai-generator" ? (
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Generator</span>
                      </div>
                    ) : (
                      tab
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "strategies" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Marketing Strategies</h2>
                  <button
                    onClick={() => setShowStrategyDialog(true)}
                    className="bg-gray-900 text-white hover:bg-gray-700 h-8 px-3 text-xs rounded-md flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New Strategy</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="border border-gray-100 bg-white hover:shadow-md transition-shadow cursor-pointer rounded-lg"
                      onClick={() => navigateToStrategy(strategy.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{strategy.name}</h3>
                            <span className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1 rounded-md border">
                              Active
                            </span>
                          </div>
                          <Target className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">{strategy.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${strategy.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Campaigns</p>
                            <p className="font-semibold">{strategy.campaigns}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ROI</p>
                            <p className="font-semibold text-green-600">{strategy.roi}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "campaigns" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h2>
                  <button
                    onClick={() => setShowCampaignDialog(true)}
                    className="bg-gray-900 text-white hover:bg-gray-700 h-8 px-3 text-xs rounded-md flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New Campaign</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-gray-100 bg-white hover:shadow-md transition-shadow cursor-pointer rounded-lg"
                      onClick={() => navigateToCampaign(campaign.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                            <span className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1 rounded-md border">
                              Active
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{campaign.type}</p>
                        <p className="text-xs text-gray-600">
                          Strategy: {strategies.find((s) => s.id === campaign.strategyId)?.name}
                        </p>
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Reach</p>
                            <p className="font-semibold text-sm">{campaign.reach?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Engagement</p>
                            <p className="font-semibold text-sm">{campaign.engagement?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Conversions</p>
                            <p className="font-semibold text-sm">{campaign.conversions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Marketing Activities ({activities.length} total)
                    </h2>
                    <select className="border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md border">
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowActivityDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs rounded-md flex items-center space-x-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>AI Generate</span>
                  </button>
                </div>

                {showCalendarView ? (
                  <CalendarView />
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {activities.map((activity) => {
                      const channelConfig = CHANNELS[activity.channel as keyof typeof CHANNELS]
                      const IconComponent = channelConfig?.icon || Globe
                      const contentType = CONTENT_TYPES.find((c) => c.id === activity.content)
                      const ContentIcon = contentType?.icon || FileText

                      return (
                        <div
                          key={activity.id}
                          className="border border-gray-100 bg-white hover:shadow-md transition-shadow cursor-pointer rounded-lg"
                          onClick={() => router.push(`/marketing/activities/${activity.id}`)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  <IconComponent className="h-5 w-5" style={{ color: channelConfig?.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm text-gray-600 capitalize">{activity.channel}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-600 capitalize">{activity.type}</span>
                                  </div>
                                  <h3 className="font-semibold text-gray-900 truncate">{activity.title}</h3>
                                </div>
                              </div>
                              <span className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-1 rounded-md border">
                                Published
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 mb-3">
                              <ContentIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{contentType?.name}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-500">Reach</p>
                                <p className="font-semibold text-sm">
                                  {activity.metrics?.reach?.toLocaleString() || "0"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Engagement</p>
                                <p className="font-semibold text-sm">{activity.metrics?.engagement || "0"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Clicks</p>
                                <p className="font-semibold text-sm">{activity.metrics?.clicks || "0"}</p>
                              </div>
                            </div>

                            {activity.scheduledDate && (
                              <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">{activity.scheduledDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "ai-generator" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Marketing Content Generator</h2>
                  <p className="text-sm text-gray-600">
                    Generate personalized marketing campaigns, social media content, and promotional materials using AI
                  </p>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <p>AI Marketing Content Generator is temporarily unavailable</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">Create New</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <button
                onClick={handleNewStrategy}
                className="w-full flex items-center space-x-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Strategy</div>
                  <div className="text-sm text-gray-500">Create a marketing strategy</div>
                </div>
              </button>
              <button
                onClick={handleNewCampaign}
                className="w-full flex items-center space-x-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Megaphone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Campaign</div>
                  <div className="text-sm text-gray-500">Create a marketing campaign</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowNewDialog(false)
                  setShowActivityDialog(true)
                }}
                className="w-full flex items-center space-x-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Activity</div>
                  <div className="text-sm text-gray-500">Generate AI-powered activity</div>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">Create Marketing Strategy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Strategy Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Weekend Special Promotion"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your marketing strategy goals and approach"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowStrategyDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowStrategyDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Create Strategy
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">Create Marketing Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Happy Hour Special"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Associated Strategy (Optional)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select a strategy</option>
                  <option value="weekend-events">Weekend Events Strategy</option>
                  <option value="seasonal-menu">Seasonal Menu Promotion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="promotion">Promotion</option>
                  <option value="awareness">Brand Awareness</option>
                  <option value="engagement">Customer Engagement</option>
                  <option value="retention">Customer Retention</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="7"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCampaignDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCampaignDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Generate Marketing Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Channel/Platform</label>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHANNELS).map(([channel, config]) => (
                      <SelectItem key={channel} value={channel}>
                        <div className="flex items-center space-x-2">
                          <config.icon className="h-4 w-4" />
                          <span>{channel}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedChannel && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Activity Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS[selectedChannel as keyof typeof CHANNELS]?.types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Content Type</label>
                <Select value={selectedContent} onValueChange={setSelectedContent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((content) => (
                      <SelectItem key={content.id} value={content.id}>
                        <div className="flex items-center space-x-2">
                          <content.icon className="h-4 w-4" />
                          <span>{content.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Activity Title</label>
                <Input
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="e.g., Weekend Special Pasta Promotion"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description (Optional)</label>
                <Textarea
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Additional context for AI generation..."
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">AI will generate:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Engaging captions and copy</li>
                  <li>• Relevant hashtags</li>
                  <li>• Creative suggestions</li>
                  <li>• Optimal posting times</li>
                  <li>• Visual recommendations</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={generateActivity} disabled={generatingActivity}>
                  {generatingActivity ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Activity
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

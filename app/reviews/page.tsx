"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Star,
  TrendingUp,
  Brain,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Heart,
  Share2,
  Megaphone,
  Gift,
  Camera,
  ChefHat,
  Eye,
  MessageSquare,
  Sparkles,
  Target,
  Mail,
  Phone,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"
import { AIReviewResponseGenerator } from "@/components/ai-review-response-generator"
import { enhancedApiClient } from "@/lib/api/enhanced-api-client"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  restaurant_id: string
  customer_name?: string
  platform: string
  rating: number
  title: string
  content: string
  sentiment: string
  sentiment_score: number
  date: string
  response?: string
  response_date?: string
  ai_response_suggestions?: string[]
  keywords?: string[]
  response_priority?: string
}

interface Customer {
  id: string
  name: string
  email: string
}

export default function ReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [restaurantId] = useState("rest_001")
  const [responseText, setResponseText] = useState("")
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false)
  const [autoResponseDelay, setAutoResponseDelay] = useState("6h")
  const [reviewBeforePosting, setReviewBeforePosting] = useState(true)
  const [expandedInsights, setExpandedInsights] = useState<string[]>([])
  const [expandedTasks, setExpandedTasks] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState<any>(null)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [aiActionType, setAiActionType] = useState<string>("")
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: "todo" | "progress" | "completed" }>({
    packaging: "todo",
    service: "progress",
    cleanliness: "completed",
    menu: "todo",
  })

  useEffect(() => {
    loadReviewsData()
  }, [])

  const loadReviewsData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading reviews from enhanced API client...")

      const [reviewsResponse, customersResponse] = await Promise.all([
        enhancedApiClient.getReviews(restaurantId),
        enhancedApiClient.getCustomers(restaurantId),
      ])

      if (reviewsResponse.success && customersResponse.success) {
        const reviewsData = reviewsResponse.data
        const customersData = customersResponse.data

        console.log("[v0] Loaded reviews:", reviewsData)
        console.log("[v0] Loaded customers:", customersData)

        setReviews(reviewsData)
        setCustomers(customersData)

        toast({
          title: "Reviews Loaded",
          description: `Loaded ${reviewsData.length} reviews with AI sentiment analysis`,
        })
      } else {
        throw new Error("Failed to load reviews data")
      }
    } catch (error) {
      console.error("[v0] Failed to load reviews:", error)
      toast({
        title: "Loading Error",
        description: "Using offline data. Some features may be limited.",
        variant: "destructive",
      })

      // Fallback data
      setReviews([
        {
          id: "1",
          restaurant_id: restaurantId,
          customer_name: "Sarah Johnson",
          platform: "Google",
          rating: 5,
          title: "Outstanding Italian Experience!",
          content:
            "Bella Vista exceeded all expectations. The carbonara was perfectly creamy, and the tiramisu was divine. Service was attentive without being intrusive. Will definitely return!",
          sentiment: "positive",
          sentiment_score: 0.92,
          date: "2024-01-16",
          response:
            "Thank you Sarah! We're thrilled you enjoyed your experience. Looking forward to welcoming you back soon!",
          response_date: "2024-01-17",
          ai_response_suggestions: [
            "Thank you Sarah! We're delighted you loved our carbonara and tiramisu. Your kind words mean the world to us!",
            "Sarah, thank you for this wonderful review! We're so happy our team provided attentive service. See you soon!",
            "We're thrilled you had such a great experience, Sarah! Our chef will be delighted to hear about the carbonara praise.",
          ],
          keywords: ["carbonara", "tiramisu", "service", "attentive"],
          response_priority: "high",
        },
        {
          id: "2",
          restaurant_id: restaurantId,
          customer_name: "Michael Chen",
          platform: "Yelp",
          rating: 4,
          title: "Great food, minor service delay",
          content:
            "The food quality is consistently excellent - their osso buco is the best in the city. However, service was a bit slow during our last visit, possibly due to being understaffed.",
          sentiment: "mixed",
          sentiment_score: 0.65,
          date: "2024-01-12",
          response:
            "Hi Michael, thank you for your feedback. We apologize for the service delay and have addressed staffing during peak hours. Hope to serve you better next time!",
          response_date: "2024-01-13",
          ai_response_suggestions: [
            "Michael, thank you for your honest feedback. We've increased staffing during peak hours to improve service speed.",
            "Hi Michael, we appreciate your patience and feedback. We're working to ensure faster service while maintaining our food quality.",
            "Thank you Michael for the osso buco compliment! We've addressed the staffing issue to provide better service timing.",
          ],
          keywords: ["osso buco", "service", "slow", "understaffed"],
          response_priority: "high",
        },
        {
          id: "3",
          restaurant_id: restaurantId,
          customer_name: "Anonymous",
          platform: "TripAdvisor",
          rating: 2,
          title: "Disappointing experience",
          content:
            "Food was cold when it arrived, and the server seemed disinterested. The pasta was overcooked and the pizza crust was soggy. Expected much better based on other reviews.",
          sentiment: "negative",
          sentiment_score: 0.15,
          date: "2024-01-10",
          ai_response_suggestions: [
            "We sincerely apologize for this disappointing experience. This doesn't reflect our usual standards. Please contact us directly so we can make this right.",
            "Thank you for your feedback. We take these concerns seriously and are reviewing our kitchen processes. We'd love the opportunity to provide you with a better experience.",
            "We're sorry to hear about your visit. This is not the experience we strive for. Please reach out to us directly - we'd like to invite you back for a complimentary meal.",
          ],
          keywords: ["cold food", "overcooked", "soggy", "disinterested"],
          response_priority: "urgent",
        },
      ])

      setCustomers([
        { id: "cust_001", name: "Sarah Johnson", email: "sarah.johnson@email.com" },
        { id: "cust_002", name: "Michael Chen", email: "m.chen@email.com" },
        { id: "cust_003", name: "Emily Rodriguez", email: "emily.r@email.com" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleResponseSent = (reviewId: string, response: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, response: response, response_date: new Date().toISOString().split("T")[0] }
          : review,
      ),
    )
  }

  const overallRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  const totalReviews = reviews.length

  const platformStats = [
    {
      platform: "Google",
      rating:
        reviews.filter((r) => r.platform === "Google").reduce((sum, r, _, arr) => sum + r.rating / arr.length, 0) || 0,
      count: reviews.filter((r) => r.platform === "Google").length,
      color: "bg-gray-900",
    },
    {
      platform: "Yelp",
      rating:
        reviews.filter((r) => r.platform === "Yelp").reduce((sum, r, _, arr) => sum + r.rating / arr.length, 0) || 0,
      count: reviews.filter((r) => r.platform === "Yelp").length,
      color: "bg-gray-800",
    },
    {
      platform: "TripAdvisor",
      rating:
        reviews
          .filter((r) => r.platform === "TripAdvisor")
          .reduce((sum, r, _, arr) => sum + r.rating / arr.length, 0) || 0,
      count: reviews.filter((r) => r.platform === "TripAdvisor").length,
      color: "bg-gray-700",
    },
    {
      platform: "Facebook",
      rating:
        reviews.filter((r) => r.platform === "Facebook").reduce((sum, r, _, arr) => sum + r.rating / arr.length, 0) ||
        0,
      count: reviews.filter((r) => r.platform === "Facebook").length,
      color: "bg-gray-600",
    },
  ]

  const sentimentData = {
    positive: Math.round((reviews.filter((r) => r.sentiment === "positive").length / reviews.length) * 100) || 0,
    neutral:
      Math.round(
        (reviews.filter((r) => r.sentiment === "mixed" || r.sentiment === "neutral").length / reviews.length) * 100,
      ) || 0,
    negative: Math.round((reviews.filter((r) => r.sentiment === "negative").length / reviews.length) * 100) || 0,
  }

  const aiSummary = {
    weeklyTrend: "+12%",
    keyHighlight:
      reviews.length > 0
        ? `Customers are praising ${reviews.find((r) => r.sentiment === "positive")?.title || "our service quality"}`
        : "No recent reviews",
    urgentAction:
      reviews.filter((r) => r.sentiment === "negative").length > 0
        ? `${reviews.filter((r) => r.sentiment === "negative").length} negative reviews need attention`
        : "No urgent issues",
    opportunity:
      reviews.filter((r) => r.rating >= 4).length > 0
        ? `${Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)}% of customers are satisfied - perfect for social media campaigns`
        : "Build more positive reviews",
  }

  const insights = {
    love: [
      {
        text: "Authentic flavors",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("authentic") || r.content.toLowerCase().includes("flavor"),
        ).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("authentic") || r.content.toLowerCase().includes("flavor"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        text: "Excellent service",
        count: reviews.filter((r) => r.content.toLowerCase().includes("service") && r.sentiment === "positive").length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("service") && r.sentiment === "positive")
          .map((r) => Number.parseInt(r.id)),
      },
      {
        text: "Great atmosphere",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("atmosphere") || r.content.toLowerCase().includes("ambiance"),
        ).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("atmosphere") || r.content.toLowerCase().includes("ambiance"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        text: "Fresh ingredients",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("fresh") || r.content.toLowerCase().includes("quality"),
        ).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("fresh") || r.content.toLowerCase().includes("quality"))
          .map((r) => Number.parseInt(r.id)),
      },
    ],
    improve: [
      {
        text: "Service speed",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("slow") || r.content.toLowerCase().includes("wait"),
        ).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("slow") || r.content.toLowerCase().includes("wait"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        text: "Portion sizes",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("portion") || r.content.toLowerCase().includes("small"),
        ).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("portion") || r.content.toLowerCase().includes("small"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        text: "Pricing",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("price") || r.content.toLowerCase().includes("expensive"),
        ).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("price") || r.content.toLowerCase().includes("expensive"))
          .map((r) => Number.parseInt(r.id)),
      },
    ],
    redFlags: [
      {
        text: "Food safety concerns",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("hygiene") || r.content.toLowerCase().includes("clean"),
        ).length,
        severity: "high" as const,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("hygiene") || r.content.toLowerCase().includes("clean"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        text: "Staff behavior",
        count: reviews.filter(
          (r) => r.content.toLowerCase().includes("rude") || r.content.toLowerCase().includes("unprofessional"),
        ).length,
        severity: "medium" as const,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("rude") || r.content.toLowerCase().includes("unprofessional"))
          .map((r) => Number.parseInt(r.id)),
      },
    ],
    dishes: [
      {
        name: "Carbonara",
        mentions: reviews.filter((r) => r.content.toLowerCase().includes("carbonara")).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("carbonara"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        name: "Tiramisu",
        mentions: reviews.filter((r) => r.content.toLowerCase().includes("tiramisu")).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("tiramisu"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        name: "Osso Buco",
        mentions: reviews.filter((r) => r.content.toLowerCase().includes("osso buco")).length,
        reviewIds: reviews
          .filter((r) => r.content.toLowerCase().includes("osso buco"))
          .map((r) => Number.parseInt(r.id)),
      },
      {
        name: "Pizza",
        mentions: reviews.filter((r) => r.content.toLowerCase().includes("pizza")).length,
        reviewIds: reviews.filter((r) => r.content.toLowerCase().includes("pizza")).map((r) => Number.parseInt(r.id)),
      },
    ],
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    return customer?.name || "Anonymous Customer"
  }

  const improvementTasks = [
    {
      id: "packaging",
      title: "Improve order packaging",
      description: "Upgrade to leak-proof containers and thermal bags",
      impact: "High",
      effort: "Medium",
      timeline: "2 weeks",
    },
    {
      id: "service",
      title: "Reduce wait times",
      description: "Optimize kitchen workflow and add staff during peak hours",
      impact: "High",
      effort: "High",
      timeline: "1 month",
    },
    {
      id: "cleanliness",
      title: "Enhanced hygiene protocols",
      description: "Implement stricter cleaning schedules and staff training",
      impact: "Critical",
      effort: "Medium",
      timeline: "1 week",
    },
    {
      id: "menu",
      title: "Menu clarity improvements",
      description: "Add better descriptions and allergen information",
      impact: "Medium",
      effort: "Low",
      timeline: "3 days",
    },
  ]

  const positiveAiActions = [
    {
      title: "Social Media Post",
      description: "Create a social media post featuring this positive review",
      icon: Share2,
      action: "social_post",
    },
    {
      title: "Marketing Campaign",
      description: "Use this review in marketing materials and website testimonials",
      icon: Megaphone,
      action: "marketing",
    },
    {
      title: "Loyalty Reward",
      description: "Send a thank you discount or loyalty points to this customer",
      icon: Gift,
      action: "loyalty",
    },
    {
      title: "Photo Request",
      description: "Ask customer to share photos of their experience",
      icon: Camera,
      action: "photo_request",
    },
  ]

  const negativeAiActions = [
    {
      title: "Recovery Email",
      description: "Send a personalized recovery email with compensation offer",
      icon: Mail,
      action: "recovery_email",
    },
    {
      title: "Manager Follow-up",
      description: "Schedule a personal call from the restaurant manager",
      icon: Phone,
      action: "manager_call",
    },
    {
      title: "Process Improvement",
      description: "Add this issue to the improvement task list",
      icon: Target,
      action: "improvement",
    },
    {
      title: "Staff Training",
      description: "Create targeted training based on this feedback",
      icon: ChefHat,
      action: "training",
    },
  ]

  const toggleInsight = (type: string) => {
    setExpandedInsights((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const handleInsightClick = (reviewIds: number[]) => {
    // Filter reviews based on the clicked insight
    const filteredReviews = reviews.filter((review) => reviewIds.includes(Number.parseInt(review.id)))
    console.log("Navigating to reviews:", filteredReviews)
    // In a real app, this would navigate to a filtered view
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews with AI analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <NavigationDrawer />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Reviews Intelligence</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
                AI-powered review management and sentiment analysis
              </p>
            </div>
          </div>
          <Button className="bg-gray-900 text-white hover:bg-gray-700 h-8 px-2 sm:px-3 text-xs rounded-md flex-shrink-0">
            <Brain className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">AI Insights</span>
            <span className="sm:hidden">AI</span>
          </Button>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        {/* Demo Mode Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">AI Features Active</span>
          </div>
          <p className="text-xs text-blue-700">
            Try the AI Review Response Generator - click "AI Response" on any review without a response.
          </p>
        </div>

        {/* AI Review Summary */}
        <Card className="border border-gray-100 bg-white w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <span>AI Review Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-green-800 text-sm">Weekly Trend</span>
                </div>
                <p className="text-sm text-green-700">{aiSummary.weeklyTrend} increase in positive reviews</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-blue-800 text-sm">Key Highlight</span>
                </div>
                <p className="text-sm text-blue-700 break-words">{aiSummary.keyHighlight}</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="font-medium text-red-800 text-sm">Urgent Action</span>
                </div>
                <p className="text-sm text-red-700">{aiSummary.urgentAction}</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <span className="font-medium text-yellow-800 text-sm">Opportunity</span>
                </div>
                <p className="text-sm text-yellow-700 break-words">{aiSummary.opportunity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Summary */}
        <Card className="border border-gray-100 bg-white w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">{overallRating.toFixed(1)}</span>
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 fill-current" />
              </div>
              <p className="text-sm sm:text-base text-gray-600">{totalReviews.toLocaleString()} total reviews</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 mb-6">
              {platformStats
                .filter((stat) => stat.count > 0)
                .map((stat) => (
                  <div
                    key={stat.platform}
                    className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs mb-1 rounded-md">
                        {stat.platform}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold text-sm">{stat.rating.toFixed(1)}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{stat.count}</span>
                  </div>
                ))}
            </div>

            {/* Sentiment Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Sentiment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Positive</span>
                  <span className="font-medium">{sentimentData.positive}%</span>
                </div>
                <Progress value={sentimentData.positive} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Neutral</span>
                  <span className="font-medium">{sentimentData.neutral}%</span>
                </div>
                <Progress value={sentimentData.neutral} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Negative</span>
                  <span className="font-medium">{sentimentData.negative}%</span>
                </div>
                <Progress value={sentimentData.negative} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI-Generated Insights */}
        <Card className="border border-gray-100 bg-white w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* What Customers Love */}
            <Collapsible>
              <CollapsibleTrigger
                className="flex items-center justify-between w-full p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                onClick={() => toggleInsight("love")}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Heart className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">What customers love</span>
                </div>
                {expandedInsights.includes("love") ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                {insights.love
                  .filter((item) => item.count > 0)
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleInsightClick(item.reviewIds)}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 w-full text-left"
                    >
                      <span className="text-sm min-w-0 flex-1 truncate">{item.text}</span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge className="bg-green-50 text-green-700 border-green-200 text-xs rounded-md">
                          {item.count}
                        </Badge>
                        <Eye className="h-3 w-3 text-gray-400" />
                      </div>
                    </button>
                  ))}
              </CollapsibleContent>
            </Collapsible>

            {/* What Needs Work */}
            <Collapsible>
              <CollapsibleTrigger
                className="flex items-center justify-between w-full p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                onClick={() => toggleInsight("improve")}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <TrendingUp className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">What needs work</span>
                </div>
                {expandedInsights.includes("improve") ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                {insights.improve
                  .filter((item) => item.count > 0)
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleInsightClick(item.reviewIds)}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 w-full text-left"
                    >
                      <span className="text-sm min-w-0 flex-1 truncate">{item.text}</span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs rounded-md">
                          {item.count}
                        </Badge>
                        <Eye className="h-3 w-3 text-gray-400" />
                      </div>
                    </button>
                  ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Red Flags */}
            {insights.redFlags.some((item) => item.count > 0) && (
              <Collapsible>
                <CollapsibleTrigger
                  className="flex items-center justify-between w-full p-3 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100"
                  onClick={() => toggleInsight("redFlags")}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="font-medium text-red-800 text-sm sm:text-base truncate">Red flags</span>
                  </div>
                  {expandedInsights.includes("redFlags") ? (
                    <ChevronUp className="h-4 w-4 text-red-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {insights.redFlags
                    .filter((item) => item.count > 0)
                    .map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleInsightClick(item.reviewIds)}
                        className="flex items-center justify-between p-2 bg-red-50 rounded hover:bg-red-100 w-full text-left"
                      >
                        <span className="text-sm text-red-800 min-w-0 flex-1 truncate">{item.text}</span>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge
                            className={`text-xs rounded-md ${
                              item.severity === "high"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-orange-100 text-orange-800 border-orange-300"
                            }`}
                          >
                            {item.count} • {item.severity}
                          </Badge>
                          <Eye className="h-3 w-3 text-red-400" />
                        </div>
                      </button>
                    ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Popular Dishes */}
            <Collapsible>
              <CollapsibleTrigger
                className="flex items-center justify-between w-full p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                onClick={() => toggleInsight("dishes")}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <ChefHat className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">Popular dishes</span>
                </div>
                {expandedInsights.includes("dishes") ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                {insights.dishes
                  .filter((item) => item.mentions > 0)
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleInsightClick(item.reviewIds)}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 w-full text-left"
                    >
                      <span className="text-sm min-w-0 flex-1 truncate">{item.name}</span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs rounded-md">
                          {item.mentions} mentions
                        </Badge>
                        <Eye className="h-3 w-3 text-gray-400" />
                      </div>
                    </button>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Review Feed */}
        <Card className="border border-gray-100 bg-white w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Recent Reviews</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="h-8 px-2 sm:px-3 text-xs flex-shrink-0"
              >
                <Eye className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{showAllReviews ? "Show Less" : "View All"}</span>
                <span className="sm:hidden">{showAllReviews ? "Less" : "All"}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border border-gray-100 rounded-lg p-3 sm:p-4 space-y-3 w-full">
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {(review.customer_name || "Anonymous").charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{review.customer_name || "Anonymous"}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                        <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs rounded-md">
                          {review.platform}
                        </Badge>
                        <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        <Badge
                          className={`text-xs rounded-md ${
                            review.sentiment === "positive"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : review.sentiment === "negative"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {review.sentiment} ({(review.sentiment_score * 100).toFixed(0)}%)
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">{renderStars(review.rating)}</div>
                </div>

                {/* Review Content */}
                <div className="w-full">
                  <h4 className="font-medium text-sm text-gray-900 mb-1 break-words">{review.title}</h4>
                  <p className="text-sm text-gray-700 break-words">{review.content}</p>
                </div>

                {/* Response Section */}
                {review.response ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-800">Restaurant Response</span>
                      <span className="text-xs text-blue-600">
                        {new Date(review.response_date || review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 break-words">{review.response}</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-3 border-t border-gray-100 w-full">
                    {/* AI Actions */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">AI Actions</h5>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {(review.sentiment === "positive" ? positiveAiActions : negativeAiActions)
                          .slice(0, 4)
                          .map((action, index) => (
                            <Dialog key={index}>
                              <DialogTrigger asChild>
                                <button
                                  className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-left w-full"
                                  onClick={() => setAiActionType(action.action)}
                                >
                                  <action.icon className="h-3 w-3 text-gray-600 flex-shrink-0" />
                                  <span className="text-xs text-gray-700 truncate">{action.title}</span>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-sm mx-4">
                                <DialogHeader>
                                  <DialogTitle className="text-base">{action.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-gray-600">{action.description}</p>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-2">Based on review:</p>
                                    <p className="text-sm break-words">{review.content}</p>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" size="sm">
                                      Preview
                                    </Button>
                                    <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-700">
                                      Generate
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                      <AIReviewResponseGenerator review={review} onResponseSent={handleResponseSent} />
                      <span className="text-xs text-gray-500 hidden sm:inline">Generate AI response</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Reviews will appear here once customers start leaving feedback.</p>
          </div>
        )}
      </div>
    </div>
  )
}

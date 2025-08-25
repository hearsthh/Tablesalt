"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Share2,
  Calendar,
  Eye,
  MousePointer,
  BarChart3,
  Instagram,
  Facebook,
  MessageSquare,
  Mail,
  ChefHat,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Heart,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const activityId = params.id as string

  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for activity detail
    const mockActivity = {
      id: Number.parseInt(activityId),
      title: "Weekend Special Pasta",
      description: "Showcase our signature weekend pasta special with fresh ingredients",
      channel: "Instagram",
      type: "Post",
      content: "menu_highlight",
      status: "published",
      scheduledDate: "2024-01-20T12:00:00",
      publishedDate: "2024-01-20T12:00:00",
      campaignId: 1,
      campaignName: "Weekend Special Promotion",
      strategyId: 1,
      strategyName: "Weekend Dining Boost",
      owner: "Marketing Team",
      aiGenerated: {
        caption:
          "🍝 Discover our Weekend Special Pasta! Made with fresh ingredients and love. Perfect for your weekend dining experience. Book your table now! #ItalianCuisine #WeekendSpecial #BellaVista #FreshIngredients #PastaLovers",
        hashtags: [
          "#ItalianFood",
          "#WeekendSpecial",
          "#FreshIngredients",
          "#BellaVista",
          "#Delicious",
          "#PastaLovers",
          "#WeekendDining",
        ],
        creative: "High-quality image of pasta dish with restaurant branding",
        bestTime: "Saturday 12:00 PM - 2:00 PM",
        targetAudience: "Food enthusiasts aged 25-45 in local area",
        estimatedReach: "1,200-1,500 users",
      },
      performance: {
        reach: 1247,
        impressions: 2340,
        engagement: 156,
        likes: 89,
        comments: 23,
        shares: 12,
        saves: 32,
        clicks: 23,
        profileVisits: 8,
        websiteClicks: 15,
      },
      engagement: {
        rate: 6.7,
        comments: [
          { user: "foodie_sarah", comment: "This looks absolutely delicious! 😍", time: "2h ago" },
          { user: "pasta_lover", comment: "Can't wait to try this weekend!", time: "4h ago" },
          { user: "local_diner", comment: "Best pasta in town! 🍝", time: "6h ago" },
        ],
      },
      mediaAssets: [
        {
          type: "image",
          url: "/delicious-pasta-dish.png",
          alt: "Weekend Special Pasta dish",
        },
      ],
    }

    setActivity(mockActivity)
    setLoading(false)
  }, [activityId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Published</Badge>
      case "scheduled":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
      case "draft":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>
      case "unpublished":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Unpublished</Badge>
      default:
        return null
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />
      case "Facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />
      case "WhatsApp":
        return <MessageSquare className="h-5 w-5 text-green-600" />
      case "Email":
        return <Mail className="h-5 w-5 text-purple-600" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Activity Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationDrawer />
      <div className="lg:ml-64">
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="flex items-center space-x-2 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Marketing</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                {getChannelIcon(activity.channel)}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{activity.title}</h1>
                {getStatusBadge(activity.status)}
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-2">{activity.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                <span>
                  {activity.channel} • {activity.type}
                </span>
                <span className="truncate">Campaign: {activity.campaignName}</span>
                {activity.publishedDate && (
                  <span>Published: {new Date(activity.publishedDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className="flex space-x-2 self-start sm:self-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                <Share2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none">
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Reach</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activity.performance.reach.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{activity.performance.impressions} impressions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">Engagement</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activity.performance.engagement}</div>
                <div className="text-sm text-green-600">{activity.engagement.rate}% rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Clicks</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activity.performance.clicks}</div>
                <div className="text-sm text-gray-500">{activity.performance.websiteClicks} to website</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Saves</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activity.performance.saves}</div>
                <div className="text-sm text-green-600">High save rate</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Tabs defaultValue="content" className="space-y-4 sm:space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1">
                  <TabsTrigger value="content" className="text-xs sm:text-sm">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="text-xs sm:text-sm">
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="engagement" className="text-xs sm:text-sm">
                    Engagement
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {/* AI Generated Content */}
                  {activity.aiGenerated && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                          <span>AI Generated Content</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Caption</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{activity.aiGenerated.caption}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Hashtags</h4>
                          <div className="flex flex-wrap gap-2">
                            {activity.aiGenerated.hashtags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-blue-700 bg-blue-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Best Time:</span>
                            <span className="font-medium ml-2">{activity.aiGenerated.bestTime}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Estimated Reach:</span>
                            <span className="font-medium ml-2">{activity.aiGenerated.estimatedReach}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Media Assets */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Media Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activity.mediaAssets.map((asset: any, index: number) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={asset.url || "/placeholder.svg"}
                              alt={asset.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{activity.performance.likes}</div>
                          <div className="text-sm text-gray-600">Likes</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{activity.performance.comments}</div>
                          <div className="text-sm text-gray-600">Comments</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{activity.performance.shares}</div>
                          <div className="text-sm text-gray-600">Shares</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{activity.performance.saves}</div>
                          <div className="text-sm text-gray-600">Saves</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{activity.performance.profileVisits}</div>
                          <div className="text-sm text-gray-600">Profile Visits</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{activity.performance.websiteClicks}</div>
                          <div className="text-sm text-gray-600">Website Clicks</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="engagement" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activity.engagement.comments.map((comment: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">@{comment.user}</span>
                                <span className="text-sm text-gray-500">{comment.time}</span>
                              </div>
                              <p className="text-gray-700">{comment.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Channel:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getChannelIcon(activity.channel)}
                      <span className="font-medium">{activity.channel}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Content Type:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <ChefHat className="h-4 w-4" />
                      <span className="font-medium">Menu Highlight</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Campaign:</span>
                    <div className="font-medium mt-1">{activity.campaignName}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Strategy:</span>
                    <div className="font-medium mt-1">{activity.strategyName}</div>
                  </div>
                  {activity.scheduledDate && (
                    <div>
                      <span className="text-sm text-gray-600">Scheduled:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {new Date(activity.scheduledDate).toLocaleDateString()} at{" "}
                          {new Date(activity.scheduledDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Activity
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Activity
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

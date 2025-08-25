"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  BarChart3,
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Target,
  TrendingUp,
  Hash,
  Image,
  FileText,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MessageCircle,
  Filter,
  Download,
  RefreshCw,
  Brain,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { NavigationDrawer } from "@/components/navigation-drawer"

interface Campaign {
  id: string
  name: string
  status: "draft" | "scheduled" | "active" | "paused" | "completed"
  type: "social_media" | "email" | "multi_channel"
  platforms: string[]
  startDate: string
  endDate: string
  budget?: number
  spent?: number
  posts: number
  reach: number
  engagement: number
  clicks: number
  conversions: number
  createdAt: string
}

interface ScheduledPost {
  id: string
  campaignId: string
  platform: string
  content: string
  scheduledTime: string
  status: "scheduled" | "published" | "failed"
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

interface ContentQueue {
  id: string
  name: string
  posts: number
  approved: number
  pending: number
  platforms: string[]
}

export default function CampaignManagementPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [contentQueues, setContentQueues] = useState<ContentQueue[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadCampaignData()
  }, [])

  const loadCampaignData = async () => {
    try {
      setLoading(true)

      // Mock data - in production, this would fetch from APIs
      const mockCampaigns: Campaign[] = [
        {
          id: "camp_1",
          name: "Summer Menu Launch",
          status: "active",
          type: "multi_channel",
          platforms: ["facebook", "instagram", "email"],
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          budget: 2500,
          spent: 1200,
          posts: 12,
          reach: 15400,
          engagement: 1240,
          clicks: 320,
          conversions: 45,
          createdAt: "2024-01-10",
        },
        {
          id: "camp_2",
          name: "Weekend Special Promotion",
          status: "scheduled",
          type: "social_media",
          platforms: ["instagram", "twitter"],
          startDate: "2024-01-20",
          endDate: "2024-01-22",
          posts: 6,
          reach: 0,
          engagement: 0,
          clicks: 0,
          conversions: 0,
          createdAt: "2024-01-18",
        },
        {
          id: "camp_3",
          name: "Customer Loyalty Program",
          status: "draft",
          type: "email",
          platforms: ["email", "whatsapp"],
          startDate: "2024-02-01",
          endDate: "2024-02-28",
          posts: 8,
          reach: 0,
          engagement: 0,
          clicks: 0,
          conversions: 0,
          createdAt: "2024-01-19",
        },
      ]

      const mockScheduledPosts: ScheduledPost[] = [
        {
          id: "post_1",
          campaignId: "camp_1",
          platform: "instagram",
          content: "Fresh summer flavors are here! Try our new seasonal menu featuring locally sourced ingredients...",
          scheduledTime: "2024-01-21T12:00:00Z",
          status: "scheduled",
        },
        {
          id: "post_2",
          campaignId: "camp_1",
          platform: "facebook",
          content: "Beat the heat with our refreshing summer specials! Book your table now and enjoy 20% off...",
          scheduledTime: "2024-01-21T18:00:00Z",
          status: "scheduled",
        },
        {
          id: "post_3",
          campaignId: "camp_2",
          platform: "twitter",
          content: "Weekend vibes call for weekend specials! Join us this Saturday for our signature brunch menu...",
          scheduledTime: "2024-01-20T10:00:00Z",
          status: "published",
          engagement: { likes: 45, comments: 12, shares: 8 },
        },
      ]

      const mockContentQueues: ContentQueue[] = [
        {
          id: "queue_1",
          name: "Social Media Queue",
          posts: 24,
          approved: 18,
          pending: 6,
          platforms: ["facebook", "instagram", "twitter"],
        },
        {
          id: "queue_2",
          name: "Email Campaign Queue",
          posts: 12,
          approved: 10,
          pending: 2,
          platforms: ["email"],
        },
      ]

      setCampaigns(mockCampaigns)
      setScheduledPosts(mockScheduledPosts)
      setContentQueues(mockContentQueues)

      toast({
        title: "Campaign Data Loaded",
        description: "All campaign information has been updated.",
      })
    } catch (error) {
      console.error("Failed to load campaign data:", error)
      toast({
        title: "Error",
        description: "Failed to load campaign data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-700", label: "Draft" },
      scheduled: { color: "bg-blue-100 text-blue-700", label: "Scheduled" },
      active: { color: "bg-green-100 text-green-700", label: "Active" },
      paused: { color: "bg-yellow-100 text-yellow-700", label: "Paused" },
      completed: { color: "bg-purple-100 text-purple-700", label: "Completed" },
      published: { color: "bg-green-100 text-green-700", label: "Published" },
      failed: { color: "bg-red-100 text-red-700", label: "Failed" },
    }

    const config = statusConfig[status] || statusConfig.draft
    return <Badge className={`${config.color} text-xs px-2 py-1 rounded-md`}>{config.label}</Badge>
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0)
  const totalEngagement = campaigns.reduce((sum, c) => sum + c.engagement, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <NavigationDrawer />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Campaign Management</h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Manage your social media campaigns and content across all platforms
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md"
              onClick={() =>
                toast({ title: "Generating Content", description: "AI is creating new campaign content..." })
              }
            >
              <Brain className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md"
              onClick={loadCampaignData}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              className="bg-gray-900 text-white hover:bg-gray-700 h-8 px-3 text-xs rounded-md"
              size="sm"
              onClick={() => toast({ title: "New Campaign", description: "Campaign creation wizard will open soon." })}
            >
              <Plus className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-500">Active Campaigns</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{activeCampaigns}</p>
              <p className="text-xs text-green-600">+2 this month</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-500">Total Reach</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{totalReach.toLocaleString()}</p>
              <p className="text-xs text-green-600">+15.2% vs last month</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-500">Engagement</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{totalEngagement.toLocaleString()}</p>
              <p className="text-xs text-green-600">+8.7% engagement rate</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-500">Conversions</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{totalConversions}</p>
              <p className="text-xs text-green-600">+12.3% conversion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Active Campaigns */}
              <Card className="border border-gray-100 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-gray-900">
                      <Target className="h-5 w-5 mr-2" />
                      Active Campaigns
                    </CardTitle>
                    <Link href="#campaigns">
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns
                      .filter((c) => c.status === "active")
                      .map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">{campaign.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                {campaign.platforms.map((platform) => (
                                  <div key={platform} className="text-gray-500">
                                    {getPlatformIcon(platform)}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{campaign.posts} posts</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{campaign.reach.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">reach</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Posts */}
              <Card className="border border-gray-100 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-gray-900">
                      <Clock className="h-5 w-5 mr-2" />
                      Upcoming Posts
                    </CardTitle>
                    <Link href="#content">
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                        View Schedule
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduledPosts
                      .filter((p) => p.status === "scheduled")
                      .slice(0, 3)
                      .map((post) => (
                        <div key={post.id} className="flex items-start space-x-3">
                          <div className="p-1 bg-gray-50 rounded flex-shrink-0">{getPlatformIcon(post.platform)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 line-clamp-2">{post.content}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(post.scheduledTime).toLocaleDateString()} at{" "}
                                {new Date(post.scheduledTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Queues */}
            <Card className="border border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <FileText className="h-5 w-5 mr-2" />
                  Content Queues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {contentQueues.map((queue) => (
                    <div key={queue.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{queue.name}</h4>
                        <div className="flex items-center space-x-1">
                          {queue.platforms.map((platform) => (
                            <div key={platform} className="text-gray-500">
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Posts</span>
                          <span className="font-medium">{queue.posts}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Approved</span>
                          <span className="text-green-600">{queue.approved}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pending Review</span>
                          <span className="text-yellow-600">{queue.pending}</span>
                        </div>
                        <Progress value={(queue.approved / queue.posts) * 100} className="h-2 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">All Campaigns</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="border border-gray-100 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {campaign.platforms.map((platform) => (
                              <div key={platform} className="text-gray-500">
                                {getPlatformIcon(platform)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {campaign.status === "active" ? (
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                        ) : campaign.status === "scheduled" ? (
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{campaign.posts}</p>
                        <p className="text-xs text-gray-500">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{campaign.reach.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Reach</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{campaign.engagement.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{campaign.clicks}</p>
                        <p className="text-xs text-gray-500">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{campaign.conversions}</p>
                        <p className="text-xs text-gray-500">Conversions</p>
                      </div>
                    </div>

                    {campaign.budget && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Budget Progress</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${campaign.spent?.toLocaleString()} / ${campaign.budget.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={((campaign.spent || 0) / campaign.budget) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
                <Button className="bg-gray-900 text-white h-8 px-3 text-xs" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Create Post
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Scheduled Posts */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-100 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Calendar className="h-5 w-5 mr-2" />
                      Scheduled Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduledPosts.map((post) => (
                        <div key={post.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="p-2 bg-gray-50 rounded flex-shrink-0">{getPlatformIcon(post.platform)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900 capitalize">{post.platform}</span>
                                {getStatusBadge(post.status)}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {new Date(post.scheduledTime).toLocaleDateString()} at{" "}
                                  {new Date(post.scheduledTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              {post.engagement && (
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{post.engagement.likes} likes</span>
                                  <span>{post.engagement.comments} comments</span>
                                  <span>{post.engagement.shares} shares</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="border border-gray-100 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Content
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Hash className="h-4 w-4 mr-2" />
                      Hashtag Suggestions
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Image className="h-4 w-4 mr-2" />
                      Upload Media
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Bulk Schedule
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-gray-100 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Content Ideas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">Behind the Scenes</p>
                        <p className="text-blue-700">Show your kitchen in action</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900">Customer Spotlight</p>
                        <p className="text-green-700">Feature happy customers</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-medium text-purple-900">Seasonal Menu</p>
                        <p className="text-purple-700">Highlight seasonal dishes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Campaign Analytics</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                  <Download className="h-3 w-3 mr-1" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border border-gray-100 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Impressions</span>
                      <span className="text-lg font-semibold text-gray-900">245K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Engagement Rate</span>
                      <span className="text-lg font-semibold text-green-600">8.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Click-through Rate</span>
                      <span className="text-lg font-semibold text-blue-600">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="text-lg font-semibold text-purple-600">3.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Target className="h-5 w-5 mr-2" />
                    Platform Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-gray-600">Instagram</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">12.4K</p>
                        <p className="text-xs text-green-600">+15.2%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Facebook className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Facebook</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">8.7K</p>
                        <p className="text-xs text-green-600">+8.1%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-600">Twitter</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">3.2K</p>
                        <p className="text-xs text-red-600">-2.3%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Email</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">5.1K</p>
                        <p className="text-xs text-green-600">+22.7%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledPosts
                    .filter((p) => p.engagement)
                    .map((post) => (
                      <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded flex-shrink-0">{getPlatformIcon(post.platform)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{post.engagement?.likes} likes</span>
                            <span>{post.engagement?.comments} comments</span>
                            <span>{post.engagement?.shares} shares</span>
                            <span className="capitalize">{post.platform}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {(post.engagement?.likes || 0) +
                              (post.engagement?.comments || 0) +
                              (post.engagement?.shares || 0)}
                          </p>
                          <p className="text-xs text-gray-500">total engagement</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

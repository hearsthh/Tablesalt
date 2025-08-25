"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Instagram,
  Facebook,
  MessageSquare,
  Mail,
  Eye,
  Heart,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { NavigationDrawer } from "@/components/navigation-drawer"

export default function ChannelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const channel = params.channel as string

  const [channelData, setChannelData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for channel detail
    const mockChannelData = {
      name: channel.charAt(0).toUpperCase() + channel.slice(1),
      description: `Manage your ${channel} marketing activities and campaigns`,
      totalActivities: 12,
      activeActivities: 8,
      totalReach: 15420,
      totalEngagement: 1240,
      averageEngagementRate: 8.2,
      topPerformingContent: "menu_highlight",
      activities: [
        {
          id: 1,
          title: "Weekend Special Pasta",
          type: "Post",
          status: "published",
          reach: 1247,
          engagement: 156,
          date: "2024-01-20",
        },
        {
          id: 2,
          title: "Chef's Special Video",
          type: "Reel",
          status: "scheduled",
          reach: 0,
          engagement: 0,
          date: "2024-01-22",
        },
      ],
      campaigns: [
        {
          id: 1,
          name: "Weekend Special Promotion",
          activities: 5,
          status: "active",
          performance: "High",
        },
        {
          id: 2,
          name: "New Menu Launch",
          activities: 3,
          status: "scheduled",
          performance: "Pending",
        },
      ],
    }

    setChannelData(mockChannelData)
    setLoading(false)
  }, [channel])

  const getChannelIcon = (channelName: string) => {
    switch (channelName.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-6 w-6 text-pink-600" />
      case "facebook":
        return <Facebook className="h-6 w-6 text-blue-600" />
      case "whatsapp":
        return <MessageSquare className="h-6 w-6 text-green-600" />
      case "email":
        return <Mail className="h-6 w-6 text-purple-600" />
      default:
        return <BarChart3 className="h-6 w-6" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {getChannelIcon(channelData.name)}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{channelData.name}</h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">{channelData.description}</p>
            </div>
            <Button size="sm" className="self-start sm:self-auto">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Activity</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs sm:text-sm text-gray-600">Total Activities</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{channelData.totalActivities}</div>
                <div className="text-xs sm:text-sm text-green-600">{channelData.activeActivities} active</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span className="text-xs sm:text-sm text-gray-600">Total Reach</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  {channelData.totalReach.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">This month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="text-xs sm:text-sm text-gray-600">Engagement</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  {channelData.totalEngagement.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-green-600">{channelData.averageEngagementRate}% rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-600">Top Content</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900">Menu Highlights</div>
                <div className="text-xs sm:text-sm text-gray-500">Best performing</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activities" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="activities" className="text-xs sm:text-sm">
                Activities
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="text-xs sm:text-sm">
                Campaigns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold">Channel Activities</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Activity
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {channelData.activities.map((activity: any) => (
                  <Card
                    key={activity.id}
                    className="border border-gray-100 bg-white hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/marketing/activities/${activity.id}`)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getChannelIcon(channelData.name)}
                            <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                            <Badge
                              className={
                                activity.status === "published"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                            <span>{activity.type}</span>
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs sm:text-sm">
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{activity.reach.toLocaleString()}</div>
                            <div className="text-gray-500">Reach</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{activity.engagement}</div>
                            <div className="text-gray-500">Engagement</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold">Related Campaigns</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {channelData.campaigns.map((campaign: any) => (
                  <Card
                    key={campaign.id}
                    className="border border-gray-100 bg-white hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/marketing/campaigns/${campaign.id}`)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">{campaign.name}</h3>
                          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                            <span>{campaign.activities} activities</span>
                            <Badge
                              className={
                                campaign.status === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <div className="font-medium text-gray-900">{campaign.performance}</div>
                          <div className="text-gray-500">Performance</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

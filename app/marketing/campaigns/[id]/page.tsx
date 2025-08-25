"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Edit,
  Play,
  Pause,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Instagram,
  Facebook,
  Mail,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

interface CampaignDetailPageProps {
  params: {
    id: string
  }
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock campaign data based on ID
  const campaign = {
    id: params.id,
    name:
      params.id === "1"
        ? "Weekend Special Promotion"
        : params.id === "2"
          ? "New Menu Launch"
          : params.id === "happy-hour"
            ? "Happy Hour Campaign"
            : "Customer Loyalty Program",
    status: params.id === "1" ? "active" : params.id === "2" ? "scheduled" : "active",
    type: "Multi-Channel Campaign",
    description:
      params.id === "1"
        ? "Drive weekend traffic with special offers and promotions"
        : params.id === "2"
          ? "Launch our new seasonal menu with targeted marketing"
          : params.id === "happy-hour"
            ? "Promote daily happy hour specials to increase evening traffic"
            : "Increase customer retention through loyalty rewards",
    budget: params.id === "1" ? 1500 : params.id === "2" ? 2000 : 1200,
    spent: params.id === "1" ? 890 : params.id === "2" ? 0 : 650,
    startDate: "2024-01-15",
    endDate: "2024-01-31",
    channels:
      params.id === "1"
        ? ["Instagram", "Facebook", "WhatsApp"]
        : params.id === "2"
          ? ["Instagram", "Email", "Facebook"]
          : params.id === "happy-hour"
            ? ["Instagram", "Facebook", "Email"]
            : ["WhatsApp", "Email"],
    reach: params.id === "1" ? 15600 : params.id === "2" ? 0 : 8900,
    engagement: params.id === "1" ? 1240 : params.id === "2" ? 0 : 780,
    clicks: params.id === "1" ? 847 : params.id === "2" ? 0 : 456,
    conversions: params.id === "1" ? 67 : params.id === "2" ? 0 : 45,
    revenue: params.id === "1" ? 2840 : params.id === "2" ? 0 : 1890,
    roi: params.id === "1" ? 189 : params.id === "2" ? 0 : 156,
    ctr: params.id === "1" ? 5.4 : params.id === "2" ? 0 : 5.1,
    conversionRate: params.id === "1" ? 7.9 : params.id === "2" ? 0 : 9.9,
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case "active":
        return <span className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}>Active</span>
      case "scheduled":
        return <span className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`}>Scheduled</span>
      case "completed":
        return <span className={`${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`}>Completed</span>
      case "paused":
        return <span className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`}>Paused</span>
      default:
        return null
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Instagram":
        return <Instagram className="h-4 w-4" />
      case "Facebook":
        return <Facebook className="h-4 w-4" />
      case "WhatsApp":
        return <MessageSquare className="h-4 w-4" />
      case "Email":
        return <Mail className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/marketing" className="p-2 hover:bg-gray-100 rounded-md">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{campaign.name}</h1>
              <p className="text-sm text-gray-500">{campaign.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="border border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md hover:bg-gray-50 flex items-center">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </button>
            <button className="border border-gray-200 text-gray-600 bg-white h-8 px-3 text-xs rounded-md hover:bg-gray-50 flex items-center">
              {campaign.status === "active" ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusBadge(campaign.status)}
              <span className="text-sm text-gray-500">
                {campaign.startDate} - {campaign.endDate}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{campaign.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Reach</p>
                  <p className="text-xl font-semibold text-gray-900">{campaign.reach.toLocaleString()}</p>
                </div>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+18.2%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Engagement</p>
                  <p className="text-xl font-semibold text-gray-900">{campaign.engagement.toLocaleString()}</p>
                </div>
                <MousePointer className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+12.4%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Conversions</p>
                  <p className="text-xl font-semibold text-gray-900">{campaign.conversions}</p>
                </div>
                <Target className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+15.7%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-xl font-semibold text-gray-900">${campaign.revenue}</p>
                </div>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+{campaign.roi}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["overview", "activities", "channels", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Spending</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Budget</span>
                        <span className="font-semibold text-gray-900">${campaign.budget}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Amount Spent</span>
                        <span className="font-semibold text-gray-900">${campaign.spent}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Remaining</span>
                        <span className="font-semibold text-gray-900">${campaign.budget - campaign.spent}</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Budget Usage</span>
                          <span className="font-medium text-gray-900">
                            {Math.round((campaign.spent / campaign.budget) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Click-through Rate</span>
                        <span className="font-semibold text-gray-900">{campaign.ctr}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Conversion Rate</span>
                        <span className="font-semibold text-gray-900">{campaign.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Return on Investment</span>
                        <span className="font-semibold text-green-600">+{campaign.roi}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Cost per Conversion</span>
                        <span className="font-semibold text-gray-900">
                          ${campaign.conversions > 0 ? Math.round(campaign.spent / campaign.conversions) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {campaign.channels.map((channel, index) => {
                      const IconComponent = getChannelIcon(channel)
                      return (
                        <div key={index} className="p-4 border border-gray-100 rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            {IconComponent}
                            <h4 className="font-medium text-gray-900">{channel}</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Reach:</span>
                              <span className="font-medium text-gray-900">
                                {Math.round(campaign.reach / campaign.channels.length).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Engagement:</span>
                              <span className="font-medium text-gray-900">
                                {Math.round(campaign.engagement / campaign.channels.length)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="bg-white border border-gray-100 rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Activities</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">Activities data will be displayed here</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "channels" && (
            <div className="bg-white border border-gray-100 rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">Channel performance data will be displayed here</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-white border border-gray-100 rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Analytics</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">Advanced analytics coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

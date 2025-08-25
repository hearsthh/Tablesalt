"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function StrategyDetailPage({ params }: { params: { id: string } }) {
  // Mock strategy data - in real app, fetch based on params.id
  const strategy = {
    id: params.id,
    name: "Weekend Traffic Boost",
    description:
      "Comprehensive strategy to increase weekend foot traffic and orders through targeted promotions and social media engagement",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    budget: 5000,
    spent: 2890,
    progress: 75,
    campaigns: [
      {
        id: "weekend-special",
        name: "Weekend Special Promotion",
        status: "published",
        budget: 1500,
        spent: 890,
        reach: 15600,
        orders: 67,
        roi: 219,
      },
      {
        id: "happy-hour",
        name: "Happy Hour Campaign",
        status: "scheduled",
        budget: 1200,
        spent: 0,
        reach: 0,
        orders: 0,
        roi: 0,
      },
      {
        id: "weekend-events",
        name: "Weekend Events Promotion",
        status: "draft",
        budget: 800,
        spent: 0,
        reach: 0,
        orders: 0,
        roi: 0,
      },
    ],
    milestones: [
      {
        id: 1,
        title: "Launch Weekend Special Campaign",
        description: "Deploy social media campaign for weekend specials",
        status: "completed",
        dueDate: "2024-01-15",
        completedDate: "2024-01-15",
      },
      {
        id: 2,
        title: "Analyze First Month Performance",
        description: "Review metrics and optimize campaigns",
        status: "completed",
        dueDate: "2024-02-01",
        completedDate: "2024-02-01",
      },
      {
        id: 3,
        title: "Launch Happy Hour Campaign",
        description: "Deploy targeted happy hour promotions",
        status: "in_progress",
        dueDate: "2024-02-15",
        completedDate: null,
      },
      {
        id: 4,
        title: "Weekend Events Integration",
        description: "Integrate special weekend events into strategy",
        status: "pending",
        dueDate: "2024-03-01",
        completedDate: null,
      },
    ],
    metrics: {
      totalReach: 15600,
      totalOrders: 67,
      totalRevenue: 2840,
      avgROI: 219,
      conversionRate: 4.3,
      customerAcquisition: 23,
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "active":
      case "completed":
        return "bg-black text-white"
      case "scheduled":
      case "in_progress":
        return "bg-gray-600 text-white"
      case "draft":
      case "pending":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-300 text-black"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "in_progress":
        return <Clock className="h-3 w-3" />
      case "pending":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <CheckCircle className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = date.toLocaleDateString("en-US", { month: "short" }).toLowerCase()
    return `${day}-${month}`
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/marketing">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-black">{strategy.name}</h1>
              <p className="text-sm text-gray-600">Marketing Strategy</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(strategy.status)}>
              <span className="capitalize">{strategy.status}</span>
            </Badge>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 bg-white">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Strategy Overview Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Strategy Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-100 bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500">Description:</span>
                  <p className="text-sm text-gray-900 mt-1">{strategy.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Start Date:</span>
                    <p className="text-sm font-medium text-gray-900">{formatDate(strategy.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">End Date:</span>
                    <p className="text-sm font-medium text-gray-900">{formatDate(strategy.endDate)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Budget:</span>
                    <p className="text-sm font-medium text-gray-900">${strategy.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Spent:</span>
                    <p className="text-sm font-medium text-gray-900">${strategy.spent.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">{strategy.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${strategy.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {strategy.metrics.totalReach.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Total Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{strategy.metrics.totalOrders}</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${strategy.metrics.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{strategy.metrics.avgROI}%</div>
                  <div className="text-xs text-gray-500">Avg ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{strategy.metrics.conversionRate}%</div>
                  <div className="text-xs text-gray-500">Conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{strategy.metrics.customerAcquisition}</div>
                  <div className="text-xs text-gray-500">New Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Associated Campaigns Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Associated Campaigns</h2>
          <div className="space-y-3">
            {strategy.campaigns.map((campaign, index) => (
              <div
                key={index}
                className="border border-gray-100 bg-white rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => (window.location.href = `/marketing/campaigns/${campaign.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Budget: ${campaign.budget.toLocaleString()}</span>
                      <span>Spent: ${campaign.spent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Reach:</span>
                    <span className="font-medium ml-1 text-gray-900">{campaign.reach.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Orders:</span>
                    <span className="font-medium ml-1 text-gray-900">{campaign.orders}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ROI:</span>
                    <span className="font-medium ml-1 text-gray-900">{campaign.roi}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Milestones Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Strategy Milestones</h2>
          <div className="space-y-3">
            {strategy.milestones.map((milestone, index) => (
              <div key={index} className="border border-gray-100 bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-md flex items-center space-x-1 ${getStatusColor(milestone.status)}`}
                      >
                        {getStatusIcon(milestone.status)}
                        <span className="capitalize">{milestone.status.replace("_", " ")}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{milestone.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {formatDate(milestone.dueDate)}</span>
                      </div>
                      {milestone.completedDate && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Completed: {formatDate(milestone.completedDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

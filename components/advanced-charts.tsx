"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ChartData {
  name: string
  value: number
  revenue?: number
  orders?: number
  customers?: number
  [key: string]: any
}

interface AdvancedChartProps {
  title: string
  data: ChartData[]
  type: "line" | "area" | "bar" | "pie" | "composed"
  height?: number
  showTrend?: boolean
  trendValue?: number
  trendDirection?: "up" | "down" | "neutral"
  dataKeys?: string[]
  colors?: string[]
  className?: string
}

const defaultColors = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
  "#EF4444", // red
  "#8B5CF6", // purple
  "#06B6D4", // cyan
  "#F97316", // orange
  "#84CC16", // lime
]

export function AdvancedChart({
  title,
  data,
  type,
  height = 300,
  showTrend = false,
  trendValue,
  trendDirection,
  dataKeys = ["value"],
  colors = defaultColors,
  className = "",
}: AdvancedChartProps) {
  const getTrendIcon = () => {
    switch (trendDirection) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-green-600 bg-green-50"
      case "down":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case "composed":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill={colors[0]} radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="revenue" stroke={colors[1]} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {showTrend && trendValue && (
            <Badge className={`${getTrendColor()} border-0 px-2 py-1 text-xs font-medium`}>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                {trendValue > 0 ? "+" : ""}
                {trendValue}%
              </div>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}

// Specialized chart components for common use cases
export function RevenueChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <AdvancedChart
      title="Revenue Trend"
      data={data}
      type="area"
      height={height}
      showTrend={true}
      trendValue={12.5}
      trendDirection="up"
      dataKeys={["revenue"]}
      colors={["#10B981"]}
    />
  )
}

export function OrdersChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <AdvancedChart
      title="Orders Overview"
      data={data}
      type="composed"
      height={height}
      showTrend={true}
      trendValue={8.3}
      trendDirection="up"
      dataKeys={["orders", "revenue"]}
      colors={["#3B82F6", "#10B981"]}
    />
  )
}

export function CustomersChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <AdvancedChart
      title="Customer Growth"
      data={data}
      type="line"
      height={height}
      showTrend={true}
      trendValue={15.2}
      trendDirection="up"
      dataKeys={["customers"]}
      colors={["#8B5CF6"]}
    />
  )
}

export function MenuPerformanceChart({ data, height = 300 }: { data: ChartData[]; height?: number }) {
  return (
    <AdvancedChart
      title="Menu Item Performance"
      data={data}
      type="bar"
      height={height}
      showTrend={true}
      trendValue={-2.1}
      trendDirection="down"
      dataKeys={["value"]}
      colors={["#F59E0B"]}
    />
  )
}

export function ChartDashboard({ className = "" }: { className?: string }) {
  const mockRevenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4500 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 5500 },
  ]

  const mockOrdersData = [
    { name: "Mon", orders: 120, revenue: 2400 },
    { name: "Tue", orders: 98, revenue: 1960 },
    { name: "Wed", orders: 156, revenue: 3120 },
    { name: "Thu", orders: 134, revenue: 2680 },
    { name: "Fri", orders: 189, revenue: 3780 },
    { name: "Sat", orders: 234, revenue: 4680 },
    { name: "Sun", orders: 201, revenue: 4020 },
  ]

  const mockCustomersData = [
    { name: "Week 1", customers: 45 },
    { name: "Week 2", customers: 52 },
    { name: "Week 3", customers: 48 },
    { name: "Week 4", customers: 61 },
  ]

  const mockMenuData = [
    { name: "Pizza", value: 234 },
    { name: "Burger", value: 189 },
    { name: "Pasta", value: 156 },
    { name: "Salad", value: 98 },
    { name: "Dessert", value: 67 },
  ]

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <RevenueChart data={mockRevenueData} />
      <OrdersChart data={mockOrdersData} />
      <CustomersChart data={mockCustomersData} />
      <MenuPerformanceChart data={mockMenuData} />
    </div>
  )
}

// Export AdvancedCharts as the main component (alias for AdvancedChart)
export const AdvancedCharts = AdvancedChart

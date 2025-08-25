'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BarChart3, Download, Save, CalendarIcon, Filter, Plus, X } from 'lucide-react'
import { format } from 'date-fns'

interface ReportConfig {
  name: string
  dataSource: string
  metrics: string[]
  dimensions: string[]
  filters: { field: string; operator: string; value: string }[]
  dateRange: { from: Date | undefined; to: Date | undefined }
  chartType: string
}

interface SavedReport {
  id: string
  name: string
  config: ReportConfig
  createdAt: string
  lastRun: string
}

export function ReportBuilder() {
  const [activeTab, setActiveTab] = useState('configure')
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    dataSource: '',
    metrics: [],
    dimensions: [],
    filters: [],
    dateRange: { from: undefined, to: undefined },
    chartType: 'bar'
  })
  
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: '1',
      name: 'Monthly Revenue Report',
      config: {
        name: 'Monthly Revenue Report',
        dataSource: 'orders',
        metrics: ['revenue', 'orderCount'],
        dimensions: ['month'],
        filters: [],
        dateRange: { from: new Date(2024, 0, 1), to: new Date() },
        chartType: 'line'
      },
      createdAt: '2024-01-15',
      lastRun: '2024-01-20'
    }
  ])

  const dataSources = [
    { value: 'orders', label: 'Orders & Sales' },
    { value: 'customers', label: 'Customers' },
    { value: 'menu', label: 'Menu Items' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'marketing', label: 'Marketing Campaigns' }
  ]

  const getMetricsForDataSource = (dataSource: string) => {
    switch (dataSource) {
      case 'orders':
        return [
          { value: 'revenue', label: 'Total Revenue' },
          { value: 'orderCount', label: 'Order Count' },
          { value: 'avgOrderValue', label: 'Average Order Value' },
          { value: 'totalItems', label: 'Total Items Sold' }
        ]
      case 'customers':
        return [
          { value: 'customerCount', label: 'Customer Count' },
          { value: 'newCustomers', label: 'New Customers' },
          { value: 'returningCustomers', label: 'Returning Customers' },
          { value: 'customerLifetimeValue', label: 'Customer Lifetime Value' }
        ]
      case 'menu':
        return [
          { value: 'itemsSold', label: 'Items Sold' },
          { value: 'revenue', label: 'Revenue by Item' },
          { value: 'popularity', label: 'Popularity Score' }
        ]
      default:
        return []
    }
  }

  const getDimensionsForDataSource = (dataSource: string) => {
    switch (dataSource) {
      case 'orders':
        return [
          { value: 'date', label: 'Date' },
          { value: 'month', label: 'Month' },
          { value: 'dayOfWeek', label: 'Day of Week' },
          { value: 'hour', label: 'Hour' },
          { value: 'orderType', label: 'Order Type' }
        ]
      case 'customers':
        return [
          { value: 'segment', label: 'Customer Segment' },
          { value: 'acquisitionChannel', label: 'Acquisition Channel' },
          { value: 'location', label: 'Location' }
        ]
      case 'menu':
        return [
          { value: 'category', label: 'Category' },
          { value: 'item', label: 'Menu Item' },
          { value: 'price', label: 'Price Range' }
        ]
      default:
        return []
    }
  }

  const addFilter = () => {
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, { field: '', operator: 'equals', value: '' }]
    }))
  }

  const removeFilter = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }))
  }

  const updateFilter = (index: number, field: string, value: string) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, [field]: value } : filter
      )
    }))
  }

  const saveReport = () => {
    if (!reportConfig.name || !reportConfig.dataSource) {
      alert('Please provide a report name and select a data source')
      return
    }

    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: reportConfig.name,
      config: reportConfig,
      createdAt: new Date().toISOString().split('T')[0],
      lastRun: new Date().toISOString().split('T')[0]
    }

    setSavedReports(prev => [...prev, newReport])
    alert('Report saved successfully!')
  }

  const loadReport = (report: SavedReport) => {
    setReportConfig(report.config)
    setActiveTab('configure')
  }

  const generatePreview = () => {
    // Mock data generation based on config
    return {
      data: [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 }
      ],
      summary: {
        totalRecords: 1234,
        dateRange: reportConfig.dateRange.from && reportConfig.dateRange.to 
          ? `${format(reportConfig.dateRange.from, 'MMM dd')} - ${format(reportConfig.dateRange.to, 'MMM dd')}`
          : 'All time',
        metrics: reportConfig.metrics.length,
        dimensions: reportConfig.dimensions.length
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Report Builder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Report Builder</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Basic Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input
                      id="reportName"
                      value={reportConfig.name}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataSource">Data Source</Label>
                    <Select 
                      value={reportConfig.dataSource} 
                      onValueChange={(value) => setReportConfig(prev => ({ 
                        ...prev, 
                        dataSource: value,
                        metrics: [],
                        dimensions: []
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataSources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="chartType">Chart Type</Label>
                    <Select 
                      value={reportConfig.chartType} 
                      onValueChange={(value) => setReportConfig(prev => ({ ...prev, chartType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics & Dimensions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Metrics & Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Metrics</Label>
                    <div className="space-y-2">
                      {getMetricsForDataSource(reportConfig.dataSource).map((metric) => (
                        <label key={metric.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={reportConfig.metrics.includes(metric.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReportConfig(prev => ({
                                  ...prev,
                                  metrics: [...prev.metrics, metric.value]
                                }))
                              } else {
                                setReportConfig(prev => ({
                                  ...prev,
                                  metrics: prev.metrics.filter(m => m !== metric.value)
                                }))
                              }
                            }}
                          />
                          <span className="text-sm">{metric.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Dimensions</Label>
                    <div className="space-y-2">
                      {getDimensionsForDataSource(reportConfig.dataSource).map((dimension) => (
                        <label key={dimension.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={reportConfig.dimensions.includes(dimension.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReportConfig(prev => ({
                                  ...prev,
                                  dimensions: [...prev.dimensions, dimension.value]
                                }))
                              } else {
                                setReportConfig(prev => ({
                                  ...prev,
                                  dimensions: prev.dimensions.filter(d => d !== dimension.value)
                                }))
                              }
                            }}
                          />
                          <span className="text-sm">{dimension.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  Filters
                  <Button variant="outline" size="sm" onClick={addFilter}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Filter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportConfig.filters.length === 0 ? (
                  <p className="text-sm text-gray-500">No filters applied</p>
                ) : (
                  <div className="space-y-3">
                    {reportConfig.filters.map((filter, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select 
                          value={filter.field}
                          onValueChange={(value) => updateFilter(index, 'field', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent>
                            {getDimensionsForDataSource(reportConfig.dataSource).map((dim) => (
                              <SelectItem key={dim.value} value={dim.value}>
                                {dim.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select 
                          value={filter.operator}
                          onValueChange={(value) => updateFilter(index, 'operator', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greater">Greater than</SelectItem>
                            <SelectItem value="less">Less than</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          value={filter.value}
                          onChange={(e) => updateFilter(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="flex-1"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFilter(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveTab('preview')}>
                Preview Report
              </Button>
              <Button onClick={saveReport}>
                <Save className="h-4 w-4 mr-2" />
                Save Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {reportConfig.dataSource ? (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{reportConfig.name || 'Untitled Report'}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{reportConfig.dataSource}</Badge>
                      <Badge variant="outline">{reportConfig.chartType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Chart preview would appear here</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {reportConfig.metrics.length} metrics, {reportConfig.dimensions.length} dimensions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Configure your report first to see the preview</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('configure')}
                >
                  Go to Configuration
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedReports.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No saved reports yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('configure')}
                >
                  Create Your First Report
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {savedReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {report.config.dataSource}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Created: {report.createdAt}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last run: {report.lastRun}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => loadReport(report)}
                          >
                            Load
                          </Button>
                          <Button variant="outline" size="sm">
                            Run
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

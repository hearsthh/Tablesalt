"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Upload, Key, Webhook, Code, Mail, FileText, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface CustomIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  integration: {
    id: string
    name: string
    category: string
    customOptions: string[]
  }
}

export function CustomIntegrationModal({ isOpen, onClose, integration }: CustomIntegrationModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("csv")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(files)
  }

  const generateWebhookUrl = () => {
    return `https://api.tablesalt.ai/webhooks/${integration.id}/${Math.random().toString(36).substring(7)}`
  }

  const generateEmbedCode = () => {
    return `<script>
  (function(t,a,b,l,e,s,a,l,t){
    t.TablesaltAI=t.TablesaltAI||function(){
      (t.TablesaltAI.q=t.TablesaltAI.q||[]).push(arguments)
    };
    var script=a.createElement(b);
    script.async=1;
    script.src='https://cdn.tablesalt.ai/tracker.js';
    script.setAttribute('data-integration','${integration.id}');
    a.head.appendChild(script);
  })(window,document,'script');
</script>`
  }

  const renderCSVUpload = () => (
    <div className="space-y-4">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Upload your existing data in CSV format. We'll automatically map the fields and import your information.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="csv-upload">Upload CSV Files</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            multiple
            onChange={handleFileUpload}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, Excel (.xlsx, .xls)</p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sample CSV Format</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {`name,email,phone,orders
John Doe,john@email.com,555-0123,5
Jane Smith,jane@email.com,555-0124,3`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Field Mapping</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>• name → Customer Name</div>
              <div>• email → Email Address</div>
              <div>• phone → Phone Number</div>
              <div>• orders → Order Count</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderAPIKeys = () => (
    <div className="space-y-4">
      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          Enter your API credentials to enable automatic data synchronization with {integration.name}.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={formData.apiKey || ""}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="api-secret">API Secret (if required)</Label>
          <Input
            id="api-secret"
            type="password"
            placeholder="Enter your API secret"
            value={formData.apiSecret || ""}
            onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="base-url">Base URL (if custom)</Label>
          <Input
            id="base-url"
            placeholder="https://api.example.com/v1"
            value={formData.baseUrl || ""}
            onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
          />
        </div>

        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">How to find your API credentials</h4>
                <p className="text-sm text-blue-700 mt-1">
                  1. Log into your {integration.name} dashboard
                  <br />
                  2. Navigate to Settings → API or Developer section
                  <br />
                  3. Generate or copy your API key and secret
                </p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open {integration.name} Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderWebhooks = () => {
    const webhookUrl = generateWebhookUrl()

    return (
      <div className="space-y-4">
        <Alert>
          <Webhook className="h-4 w-4" />
          <AlertDescription>
            Configure webhooks to receive real-time updates from {integration.name} directly to Tablesalt AI.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label>Your Webhook URL</Label>
            <div className="flex gap-2 mt-1">
              <Input value={webhookUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Copy this URL and add it to your {integration.name} webhook settings
            </p>
          </div>

          <div>
            <Label htmlFor="webhook-events">Events to Subscribe</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["order.created", "order.updated", "customer.created", "review.created"].map((event) => (
                <label key={event} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  {event}
                </label>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Webhook Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>1. Copy the webhook URL above</div>
              <div>2. Go to your {integration.name} settings</div>
              <div>3. Find the "Webhooks" or "API" section</div>
              <div>4. Add the URL and select events</div>
              <div>5. Save and test the connection</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderEmbedCode = () => {
    const embedCode = generateEmbedCode()

    return (
      <div className="space-y-4">
        <Alert>
          <Code className="h-4 w-4" />
          <AlertDescription>
            Add this tracking code to your website to automatically capture customer interactions and data.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label>Embed Code</Label>
            <div className="relative mt-1">
              <Textarea value={embedCode} readOnly className="font-mono text-xs h-32 resize-none" />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-transparent"
                onClick={() => copyToClipboard(embedCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Installation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>1. Copy the code above</div>
                <div>2. Paste it before the closing &lt;/head&gt; tag</div>
                <div>3. Deploy your website</div>
                <div>4. Data will start flowing automatically</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">What it tracks</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>• Page views and user sessions</div>
                <div>• Form submissions</div>
                <div>• Button clicks and interactions</div>
                <div>• Customer journey data</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderEmailForwarding = () => (
    <div className="space-y-4">
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          Forward emails from {integration.name} to automatically import reviews, orders, and notifications.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label>Your Forwarding Email</Label>
          <div className="flex gap-2 mt-1">
            <Input value={`${integration.id}@import.tablesalt.ai`} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`${integration.id}@import.tablesalt.ai`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Forward emails from {integration.name} to this address</p>
        </div>

        <div>
          <Label htmlFor="email-types">Email Types to Forward</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {["Order confirmations", "Review notifications", "Customer inquiries", "Payment receipts"].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                {type}
              </label>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>1. Copy the forwarding email above</div>
            <div>2. Go to your email client settings</div>
            <div>3. Create a forwarding rule for {integration.name} emails</div>
            <div>4. Set the forwarding address</div>
            <div>5. Test with a sample email</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderManualEntry = () => (
    <div className="space-y-4">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Manually enter your data using our guided forms. Perfect for one-time imports or small datasets.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="data-type">Data Type</Label>
          <select
            id="data-type"
            className="w-full p-2 border rounded-md mt-1"
            value={formData.dataType || ""}
            onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
          >
            <option value="">Select data type</option>
            <option value="customers">Customer Information</option>
            <option value="menu">Menu Items</option>
            <option value="orders">Order History</option>
            <option value="reviews">Reviews</option>
          </select>
        </div>

        <div>
          <Label htmlFor="manual-data">Data Entry</Label>
          <Textarea
            id="manual-data"
            placeholder="Enter your data here, one item per line..."
            className="h-32 mt-1"
            value={formData.manualData || ""}
            onChange={(e) => setFormData({ ...formData, manualData: e.target.value })}
          />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Format Examples</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div>
                <strong>Customers:</strong> Name, Email, Phone
              </div>
              <div>
                <strong>Menu:</strong> Item Name, Price, Category
              </div>
              <div>
                <strong>Orders:</strong> Order ID, Customer, Total, Date
              </div>
              <div>
                <strong>Reviews:</strong> Customer, Rating, Comment, Date
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const methodTabs = [
    { id: "csv", label: "CSV Upload", icon: Upload, component: renderCSVUpload },
    { id: "api", label: "API Keys", icon: Key, component: renderAPIKeys },
    { id: "webhook", label: "Webhooks", icon: Webhook, component: renderWebhooks },
    { id: "embed", label: "Embed Code", icon: Code, component: renderEmbedCode },
    { id: "email", label: "Email Forward", icon: Mail, component: renderEmailForwarding },
    { id: "manual", label: "Manual Entry", icon: FileText, component: renderManualEntry },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom Integration: {integration.name}
          </DialogTitle>
          <DialogDescription>
            Choose a method to connect {integration.name} with Tablesalt AI. Multiple methods can be used together.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {methodTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {methodTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tab.component()}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Test Connection</Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Integration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

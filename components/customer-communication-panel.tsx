'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Mail, MessageSquare, Phone, Send, Clock, CheckCircle, AlertCircle, User } from 'lucide-react'
import { logEvent } from '@/lib/analytics'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  lastOrder?: string
  totalOrders: number
  totalSpent: number
  status: 'active' | 'inactive' | 'vip'
}

interface CommunicationHistory {
  id: string
  type: 'email' | 'sms' | 'call'
  subject?: string
  message: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  response?: string
}

interface CustomerCommunicationPanelProps {
  customer: Customer
  history?: CommunicationHistory[]
}

export function CustomerCommunicationPanel({ customer, history = [] }: CustomerCommunicationPanelProps) {
  const [activeTab, setActiveTab] = useState('email')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [template, setTemplate] = useState('')
  const [sending, setSending] = useState(false)

  const templates = {
    email: [
      { id: 'welcome', name: 'Welcome Back', subject: 'We miss you!', content: 'Hi {name}, we noticed you haven\'t visited us in a while. Come back and enjoy 10% off your next order!' },
      { id: 'birthday', name: 'Birthday Offer', subject: 'Happy Birthday!', content: 'Happy Birthday {name}! Celebrate with us and get a free dessert on your special day.' },
      { id: 'feedback', name: 'Feedback Request', subject: 'How was your experience?', content: 'Hi {name}, we\'d love to hear about your recent visit. Your feedback helps us improve!' },
      { id: 'promotion', name: 'Special Promotion', subject: 'Exclusive offer just for you', content: 'Hi {name}, as one of our valued customers, enjoy this exclusive 15% discount on your next order.' }
    ],
    sms: [
      { id: 'reminder', name: 'Order Reminder', content: 'Hi {name}, your table is ready! Please arrive within 15 minutes.' },
      { id: 'promotion', name: 'Quick Promotion', content: 'Hi {name}! 🍕 Get 20% off today only. Show this message at checkout.' },
      { id: 'feedback', name: 'Quick Feedback', content: 'Hi {name}, how was your meal today? Reply with a rating 1-5. Thanks!' }
    ]
  }

  const handleSendEmail = async () => {
    setSending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      logEvent('customer_contacted', { 
        customerId: customer.id, 
        type: 'email',
        message: 'Email sent successfully'
      })
      setEmailSubject('')
      setEmailMessage('')
      alert('Email sent successfully!')
    } catch (error) {
      alert('Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const handleSendSMS = async () => {
    setSending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      logEvent('customer_contacted', { 
        customerId: customer.id, 
        type: 'sms',
        message: 'SMS sent successfully'
      })
      setSmsMessage('')
      alert('SMS sent successfully!')
    } catch (error) {
      alert('Failed to send SMS')
    } finally {
      setSending(false)
    }
  }

  const applyTemplate = (templateId: string, type: 'email' | 'sms') => {
    const templateList = templates[type]
    const selectedTemplate = templateList.find(t => t.id === templateId)
    if (!selectedTemplate) return

    const personalizedContent = selectedTemplate.content.replace('{name}', customer.name)
    
    if (type === 'email') {
      setEmailSubject(selectedTemplate.subject || '')
      setEmailMessage(personalizedContent)
    } else {
      setSmsMessage(personalizedContent)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">{customer.name}</div>
                  <div className="text-xs text-gray-500">{customer.email}</div>
                  {customer.phone && (
                    <div className="text-xs text-gray-500">{customer.phone}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={customer.status === 'vip' ? 'default' : 'secondary'}>
                    {customer.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div>Total Orders: {customer.totalOrders}</div>
                  <div>Total Spent: ${customer.totalSpent}</div>
                  {customer.lastOrder && (
                    <div>Last Order: {customer.lastOrder}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication History */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Recent Communications</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-xs text-gray-500">No previous communications</p>
                ) : (
                  <div className="space-y-2">
                    {history.slice(0, 5).map((comm) => (
                      <div key={comm.id} className="p-2 border border-gray-100 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            {comm.type === 'email' && <Mail className="h-3 w-3" />}
                            {comm.type === 'sms' && <MessageSquare className="h-3 w-3" />}
                            {comm.type === 'call' && <Phone className="h-3 w-3" />}
                            <span className="font-medium">{comm.type.toUpperCase()}</span>
                          </div>
                          <StatusIcon status={comm.status} />
                        </div>
                        {comm.subject && (
                          <div className="font-medium mb-1">{comm.subject}</div>
                        )}
                        <div className="text-gray-600 mb-1">{comm.message.slice(0, 50)}...</div>
                        <div className="text-gray-400">{comm.timestamp}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Communication Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Template</label>
                  <Select value={template} onValueChange={(value) => {
                    setTemplate(value)
                    applyTemplate(value, 'email')
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.email.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Write your email message..."
                    rows={8}
                  />
                </div>

                <Button 
                  onClick={handleSendEmail}
                  disabled={!emailSubject || !emailMessage || sending}
                  className="w-full"
                >
                  {sending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Template</label>
                  <Select value={template} onValueChange={(value) => {
                    setTemplate(value)
                    applyTemplate(value, 'sms')
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.sms.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Write your SMS message..."
                    rows={6}
                    maxLength={160}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {smsMessage.length}/160 characters
                  </div>
                </div>

                {!customer.phone && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">No phone number on file for this customer</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSendSMS}
                  disabled={!smsMessage || !customer.phone || sending}
                  className="w-full"
                >
                  {sending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'sent':
      return <Clock className="h-3 w-3 text-blue-500" />
    case 'delivered':
      return <CheckCircle className="h-3 w-3 text-green-500" />
    case 'read':
      return <CheckCircle className="h-3 w-3 text-green-600" />
    case 'failed':
      return <AlertCircle className="h-3 w-3 text-red-500" />
    default:
      return <Clock className="h-3 w-3 text-gray-400" />
  }
}

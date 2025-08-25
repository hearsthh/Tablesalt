'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Send, Users, MessageSquare, Mail, Phone, Heart, RotateCcw, AlertTriangle, Gift, ArrowLeft, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  segment: string
  behaviorTags: string[]
  favoriteItems: string[]
  lastOrder: string
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  churnRisk: string
  aiSegment: string
  avatar: string
}

interface BulkCommunicationPanelProps {
  selectedCustomers: Customer[]
  onComplete: () => void
}

type CommunicationType = 'ai_offer' | 'thank_you' | 'win_back' | 'apology' | 'birthday' | 'feedback' | 'custom'
type Channel = 'email' | 'sms' | 'whatsapp'

const communicationTypes = [
  {
    id: 'ai_offer' as CommunicationType,
    name: 'AI Personalized Offers',
    description: 'Generate unique offers for each customer',
    icon: Sparkles,
    color: 'text-purple-600'
  },
  {
    id: 'thank_you' as CommunicationType,
    name: 'Thank You Notes',
    description: 'Express gratitude to loyal customers',
    icon: Heart,
    color: 'text-pink-600'
  },
  {
    id: 'win_back' as CommunicationType,
    name: 'Win-Back Messages',
    description: 'Re-engage inactive customers',
    icon: RotateCcw,
    color: 'text-orange-600'
  },
  {
    id: 'apology' as CommunicationType,
    name: 'Apology Notes',
    description: 'Address service issues professionally',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    id: 'birthday' as CommunicationType,
    name: 'Birthday Wishes',
    description: 'Celebrate customer birthdays',
    icon: Gift,
    color: 'text-yellow-600'
  },
  {
    id: 'feedback' as CommunicationType,
    name: 'Feedback Requests',
    description: 'Gather customer reviews and feedback',
    icon: MessageSquare,
    color: 'text-blue-600'
  }
]

export function BulkCommunicationPanel({ selectedCustomers, onComplete }: BulkCommunicationPanelProps) {
  const [currentStep, setCurrentStep] = useState<'type' | 'customize' | 'preview' | 'sending' | 'complete'>('type')
  const [selectedType, setSelectedType] = useState<CommunicationType | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel>('email')
  const [customMessage, setCustomMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const { toast } = useToast()

  const getMessageTemplate = (type: CommunicationType, customerName: string) => {
    const templates = {
      ai_offer: `Hi ${customerName}! We have a special personalized offer just for you based on your preferences.`,
      thank_you: `Dear ${customerName}, thank you for being such a valued customer! Your loyalty means the world to us.`,
      win_back: `Hi ${customerName}, we miss you! Come back and enjoy a special welcome back offer on us.`,
      apology: `Dear ${customerName}, we sincerely apologize for any inconvenience. We're committed to making it right.`,
      birthday: `Happy Birthday ${customerName}! 🎉 Celebrate with us and enjoy a special birthday treat!`,
      feedback: `Hi ${customerName}, we'd love to hear about your recent experience with us. Your feedback helps us improve!`
    }
    return templates[type] || customMessage
  }

  const handleSend = async () => {
    if (!selectedType) return
    
    setCurrentStep('sending')
    setIsSending(true)
    setSentCount(0)

    try {
      // Simulate sending to each customer with progress
      for (let i = 0; i < selectedCustomers.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setSentCount(i + 1)
      }

      setCurrentStep('complete')
      
      toast({
        title: "Messages sent successfully!",
        description: `${selectedCustomers.length} ${selectedType.replace('_', ' ')} messages sent via ${selectedChannel.toUpperCase()}`,
      })

    } catch (error) {
      toast({
        title: "Failed to send messages",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  const resetFlow = () => {
    setCurrentStep('type')
    setSelectedType(null)
    setCustomMessage('')
    setSentCount(0)
  }

  const handleComplete = () => {
    onComplete()
    resetFlow()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Bulk Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0 mx-4">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center gap-2">
              {currentStep !== 'type' && currentStep !== 'complete' && (
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep('type')} className="p-1 h-6 w-6">
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              )}
              <div>
                <DialogTitle className="text-sm font-medium">
                  Bulk Communication
                </DialogTitle>
                <p className="text-xs text-gray-500">
                  {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-4">
              {/* Step 1: Select Communication Type */}
              {currentStep === 'type' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Choose Communication Type</h3>
                    <div className="space-y-2">
                      {communicationTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <div
                            key={type.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedType === type.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedType(type.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`h-4 w-4 mt-0.5 ${type.color}`} />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900">{type.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {selectedType && (
                    <Button 
                      onClick={() => setCurrentStep('customize')} 
                      className="w-full"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              )}

              {/* Step 2: Customize Message */}
              {currentStep === 'customize' && selectedType && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Customize Your Message</h3>
                    
                    {/* Channel Selection */}
                    <div className="mb-4">
                      <Label className="text-xs text-gray-600 mb-2 block">Send Via</Label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['email', 'sms', 'whatsapp'] as Channel[]).map((channel) => (
                          <Button
                            key={channel}
                            variant={selectedChannel === channel ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedChannel(channel)}
                            className="flex flex-col items-center gap-1 h-12 text-xs p-1"
                          >
                            {channel === 'email' && <Mail className="h-4 w-4" />}
                            {channel === 'sms' && <Phone className="h-4 w-4" />}
                            {channel === 'whatsapp' && <MessageSquare className="h-4 w-4" />}
                            <span className="capitalize">{channel}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Message Template */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Message Template</Label>
                      <Textarea
                        value={customMessage || getMessageTemplate(selectedType, '{Customer Name}')}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Customize your message..."
                        rows={4}
                        className="text-xs resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {'{Customer Name}'} for personalization
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep('preview')} 
                    className="w-full"
                  >
                    Preview Messages
                  </Button>
                </div>
              )}

              {/* Step 3: Preview */}
              {currentStep === 'preview' && selectedType && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Preview Messages</h3>
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {communicationTypes.find(t => t.id === selectedType)?.name}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {selectedChannel.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Sending to {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Sample Preview */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedCustomers.slice(0, 3).map((customer) => (
                        <div key={customer.id} className="bg-white border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">{customer.avatar}</span>
                            </div>
                            <span className="text-xs font-medium">{customer.name}</span>
                          </div>
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            {getMessageTemplate(selectedType, customer.name)}
                          </div>
                        </div>
                      ))}
                      {selectedCustomers.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-2">
                          +{selectedCustomers.length - 3} more customers
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSend} 
                    className="w-full"
                    disabled={isSending}
                  >
                    Send to All Customers
                  </Button>
                </div>
              )}

              {/* Step 4: Sending Progress */}
              {currentStep === 'sending' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Send className="h-8 w-8 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2">Sending Messages...</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      {sentCount} of {selectedCustomers.length} sent
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(sentCount / selectedCustomers.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 'complete' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2">Messages Sent Successfully!</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      {selectedCustomers.length} {selectedType?.replace('_', ' ')} messages sent via {selectedChannel.toUpperCase()}
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700">
                        You can track delivery status and responses in the notification center.
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleComplete} className="w-full">
                    Done
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

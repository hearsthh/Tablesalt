'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Info, Star, TrendingUp, X } from 'lucide-react'
import { useNotificationsStore } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'

interface NotificationItemProps {
  notification: any
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'feature':
        return <Star className="h-4 w-4 text-blue-500" />
      case 'billing':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500'
      case 'high':
        return 'border-l-orange-500'
      case 'normal':
        return 'border-l-blue-500'
      case 'low':
        return 'border-l-gray-300'
      default:
        return 'border-l-gray-300'
    }
  }

  return (
    <div className={`p-3 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'} leading-tight`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notification.id)}
                className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            
            <div className="flex items-center gap-2">
              {notification.actionUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id)
                    }
                    // Handle action URL navigation
                    window.open(notification.actionUrl, '_blank')
                  }}
                >
                  {notification.actionText || 'Take Action'}
                </Button>
              )}
              
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationsStore()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, fetchNotifications])

  // Sample notifications for demo
  const sampleNotifications = [
    {
      id: '1',
      organizationId: 'org1',
      userId: 'user1',
      type: 'alert',
      title: 'High Churn Risk Alert',
      message: '5 customers are showing high churn risk. Consider sending win-back campaigns.',
      data: { customerCount: 5 },
      actionUrl: '/customer-intelligence?filter=at-risk',
      actionText: 'View Customers',
      read: false,
      priority: 'high',
      channels: ['in_app'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: '2',
      organizationId: 'org1',
      userId: 'user1',
      type: 'feature',
      title: 'New AI Feature Available',
      message: 'Menu optimization AI is now available in your plan. Boost your revenue with smart recommendations.',
      data: { feature: 'menu_ai_optimization' },
      actionUrl: '/menu/ai/optimization',
      actionText: 'Try Now',
      read: false,
      priority: 'normal',
      channels: ['in_app'],
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      id: '3',
      organizationId: 'org1',
      userId: 'user1',
      type: 'system',
      title: 'Bulk Communication Sent',
      message: 'Successfully sent 25 thank you messages to your VIP customers.',
      data: { messageCount: 25, type: 'thank_you' },
      read: true,
      priority: 'normal',
      channels: ['in_app'],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: '4',
      organizationId: 'org1',
      userId: 'user1',
      type: 'billing',
      title: 'Usage Limit Warning',
      message: 'You have used 80% of your monthly email quota. Consider upgrading your plan.',
      data: { usage: 800, limit: 1000, type: 'emails' },
      actionUrl: '/settings/billing',
      actionText: 'Upgrade Plan',
      read: false,
      priority: 'high',
      channels: ['in_app'],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
    },
    {
      id: '5',
      organizationId: 'org1',
      userId: 'user1',
      type: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly customer insights report is ready for review.',
      data: { reportType: 'weekly_insights' },
      actionUrl: '/insights/reports/weekly',
      actionText: 'View Report',
      read: true,
      priority: 'low',
      channels: ['in_app'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ]

  // Use sample notifications for demo
  const allNotifications = sampleNotifications
  const currentUnreadCount = allNotifications.filter(n => !n.read).length

  const filteredNotifications = allNotifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.read
      case 'alerts':
        return notification.type === 'alert'
      case 'insights':
        return notification.type === 'feature' || notification.type === 'system'
      default:
        return true
    }
  })

  const handleMarkAsRead = (id: string) => {
    // In real implementation, this would call the API
    console.log('Mark as read:', id)
  }

  const handleDelete = (id: string) => {
    // In real implementation, this would call the API
    console.log('Delete notification:', id)
  }

  const handleMarkAllAsRead = () => {
    // In real implementation, this would call the API
    console.log('Mark all as read')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4" />
          {currentUnreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              {currentUnreadCount > 9 ? '9+' : currentUnreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0 mx-4">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-medium">
                Notifications
              </DialogTitle>
              {currentUnreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            {currentUnreadCount > 0 && (
              <p className="text-xs text-gray-500">
                {currentUnreadCount} unread notification{currentUnreadCount > 1 ? 's' : ''}
              </p>
            )}
          </DialogHeader>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-4 h-8">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Unread
                  {currentUnreadCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      {currentUnreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
                <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 max-h-[60vh]">
              <TabsContent value={activeTab} className="mt-0">
                <div className="space-y-1">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        No notifications
                      </h3>
                      <p className="text-xs text-gray-500">
                        {activeTab === 'unread' 
                          ? "You're all caught up!" 
                          : `No ${activeTab} notifications at the moment.`}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

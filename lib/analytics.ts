'use client'

export type AnalyticsEventType =
  | 'page_view'
  | 'integration_connected'
  | 'integration_disconnected'
  | 'review_response_sent'
  | 'campaign_started'
  | 'customer_contacted'

export type AnalyticsEvent<T = Record<string, any>> = {
  id: string
  type: AnalyticsEventType
  timestamp: number
  payload?: T
}

const STORAGE_KEY = 'ts_analytics_events_v1'
const NSM_KEY = 'ts_north_star_metric_v1'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readEvents(): AnalyticsEvent[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AnalyticsEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeEvents(events: AnalyticsEvent[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function logEvent<T = Record<string, any>>(type: AnalyticsEventType, payload?: T) {
  if (!isBrowser()) return
  const events = readEvents()
  const evt: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    timestamp: Date.now(),
    payload,
  }
  events.push(evt)
  writeEvents(events)
}

export function getEvents(limit?: number): AnalyticsEvent[] {
  const events = readEvents().sort((a, b) => b.timestamp - a.timestamp)
  return typeof limit === 'number' ? events.slice(0, limit) : events
}

export type AnalyticsSummary = {
  totals: {
    pageViews: number
    integrationsConnected: number
    integrationsDisconnected: number
    reviewsResponded: number
    campaignsStarted: number
    customersContacted: number
  }
  pageViewsByPage: Record<string, number>
  lastUpdated: number | null
}

export function getSummary(): AnalyticsSummary {
  const events = readEvents()
  const totals = {
    pageViews: 0,
    integrationsConnected: 0,
    integrationsDisconnected: 0,
    reviewsResponded: 0,
    campaignsStarted: 0,
    customersContacted: 0,
  }
  const pageViewsByPage: Record<string, number> = {}

  let lastUpdated: number | null = null

  for (const e of events) {
    lastUpdated = lastUpdated ? Math.max(lastUpdated, e.timestamp) : e.timestamp
    switch (e.type) {
      case 'page_view': {
        totals.pageViews += 1
        const p = (e.payload?.page as string) || 'unknown'
        pageViewsByPage[p] = (pageViewsByPage[p] || 0) + 1
        break
      }
      case 'integration_connected':
        totals.integrationsConnected += 1
        break
      case 'integration_disconnected':
        totals.integrationsDisconnected += 1
        break
      case 'review_response_sent':
        totals.reviewsResponded += 1
        break
      case 'campaign_started':
        totals.campaignsStarted += 1
        break
      case 'customer_contacted':
        totals.customersContacted += 1
        break
      default:
        break
    }
  }

  return { totals, pageViewsByPage, lastUpdated }
}

export function clearAnalytics() {
  if (!isBrowser()) return
  window.localStorage.removeItem(STORAGE_KEY)
}

export type NorthStarMetric =
  | 'page_views_menu'
  | 'reviews_responded'
  | 'campaigns_started'
  | 'customers_contacted'
  | 'integrations_connected'

export function getNorthStarMetric(): NorthStarMetric {
  if (!isBrowser()) return 'page_views_menu'
  const raw = window.localStorage.getItem(NSM_KEY)
  return (raw as NorthStarMetric) || 'page_views_menu'
}

export function setNorthStarMetric(metric: NorthStarMetric) {
  if (!isBrowser()) return
  window.localStorage.setItem(NSM_KEY, metric)
}

export function getNorthStarValue(metric: NorthStarMetric): number {
  const s = getSummary()
  switch (metric) {
    case 'page_views_menu':
      return s.pageViewsByPage['/menu'] || s.pageViewsByPage['menu'] || 0
    case 'reviews_responded':
      return s.totals.reviewsResponded
    case 'campaigns_started':
      return s.totals.campaignsStarted
    case 'customers_contacted':
      return s.totals.customersContacted
    case 'integrations_connected':
      return s.totals.integrationsConnected
    default:
      return 0
  }
}

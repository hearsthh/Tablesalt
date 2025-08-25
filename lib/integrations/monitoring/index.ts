export { IntegrationMonitor } from "./integration-monitor"
export { MonitoringDashboard } from "./monitoring-dashboard"
export { NotificationService } from "./notification-service"

export type {
  IntegrationHealth,
  IntegrationMetrics,
  AlertRule,
  Alert,
} from "./integration-monitor"

export type { DashboardData } from "./monitoring-dashboard"

export type {
  NotificationChannel,
  NotificationTemplate,
} from "./notification-service"

// Convenience function to set up monitoring
export function createMonitoringSystem(integrationManager: any) {
  const IntegrationMonitor = require("./integration-monitor").IntegrationMonitor
  const MonitoringDashboard = require("./monitoring-dashboard").MonitoringDashboard
  const NotificationService = require("./notification-service").NotificationService

  const monitor = new IntegrationMonitor(integrationManager)
  const dashboard = new MonitoringDashboard()
  const notifications = new NotificationService()

  // Set up default notification channels
  notifications.addChannel({
    id: "default-email",
    name: "Default Email",
    type: "email",
    config: { email: "admin@restaurant.com" },
    enabled: true,
    severityFilter: ["high", "critical"],
  })

  notifications.addChannel({
    id: "slack-alerts",
    name: "Slack Alerts",
    type: "slack",
    config: { webhook: "https://hooks.slack.com/services/..." },
    enabled: true,
    severityFilter: ["medium", "high", "critical"],
  })

  return {
    monitor,
    dashboard,
    notifications,
    startMonitoring: (intervalMinutes = 5) => monitor.startMonitoring(intervalMinutes),
    stopMonitoring: () => monitor.stopMonitoring(),
    getDashboardData: () => {
      const healthStatus = monitor.getHealthStatus()
      const alerts = monitor.getAllAlerts()
      const metricsData = new Map() // Would be populated with actual metrics
      return dashboard.generateDashboardData(healthStatus, alerts, metricsData)
    },
  }
}

import { useRealTimeUpdates } from "../lib/hooks/use-real-time"
import { Badge } from "./ui/badge"

export const RealTimeStatus = () => {
  const { isConnected, connectionStatus } = useRealTimeUpdates()

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-gray-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Live"
      case "connecting":
        return "Connecting..."
      case "disconnected":
        return "Offline"
      case "error":
        return "Error"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <Badge variant="outline" className="text-xs">
        {getStatusText()}
      </Badge>
    </div>
  )
}

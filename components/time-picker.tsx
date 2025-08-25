"use client"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OperatingHoursProps {
  value: {
    monday: { open: boolean; openTime: string; closeTime: string }
    tuesday: { open: boolean; openTime: string; closeTime: string }
    wednesday: { open: boolean; openTime: string; closeTime: string }
    thursday: { open: boolean; openTime: string; closeTime: string }
    friday: { open: boolean; openTime: string; closeTime: string }
    saturday: { open: boolean; openTime: string; closeTime: string }
    sunday: { open: boolean; openTime: string; closeTime: string }
  }
  onChange: (value: any) => void
}

export function OperatingHours({ value, onChange }: OperatingHoursProps) {
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      timeOptions.push({ value: timeString, label: displayTime })
    }
  }

  const updateDay = (day: string, field: string, newValue: any) => {
    onChange({
      ...value,
      [day]: {
        ...value[day as keyof typeof value],
        [field]: newValue,
      },
    })
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Operating Hours</Label>
      <div className="space-y-4">
        {days.map(({ key, label }) => {
          const dayData = value[key as keyof typeof value]
          return (
            <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex items-center space-x-2 min-w-[100px]">
                <Switch
                  checked={dayData.open}
                  onCheckedChange={(checked) => updateDay(key, "open", checked)}
                  id={`${key}-switch`}
                />
                <Label htmlFor={`${key}-switch`} className="text-sm font-medium">
                  {label}
                </Label>
              </div>

              {dayData.open ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Select value={dayData.openTime} onValueChange={(time) => updateDay(key, "openTime", time)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Open" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-sm text-gray-500">to</span>

                  <Select value={dayData.closeTime} onValueChange={(time) => updateDay(key, "closeTime", time)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Close" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Closed</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

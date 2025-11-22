"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Voltage monitoring chart"

export interface VoltageDataPoint {
  time: string
  voltage: number
  timestamp?: Date
}

export interface VoltageChartProps {
  data?: VoltageDataPoint[]
  title?: string
}

type TimePeriod = "hour" | "24hours" | "week"

// Generate voltage data based on time period
export function generateVoltageData(period: TimePeriod): VoltageDataPoint[] {
  const now = new Date()
  let dataPoints: number
  let intervalMs: number
  
  switch (period) {
    case "hour":
      dataPoints = 60 // one per minute
      intervalMs = 60 * 1000
      break
    case "24hours":
      dataPoints = 96 // one per 15 minutes (4 per hour)
      intervalMs = 15 * 60 * 1000
      break
    case "week":
      dataPoints = 7 // one per day
      intervalMs = 24 * 60 * 60 * 1000
      break
  }
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const intervalsAgo = dataPoints - 1 - i
    const timestamp = new Date(now.getTime() - intervalsAgo * intervalMs)
    const minutes = timestamp.getMinutes()
    const hours = timestamp.getHours()
    const day = timestamp.getDate()
    const month = timestamp.getMonth()
    
    // Simulate realistic voltage variation
    const baseVoltage = 120
    const timeVariation = Math.sin((hours - 6) * Math.PI / 12) * 2
    const noise = (Math.random() - 0.5) * 3
    const voltage = Math.round((baseVoltage + timeVariation + noise) * 10) / 10
    
    let timeLabel: string
    if (period === "hour") {
      timeLabel = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    } else if (period === "24hours") {
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      const ampm = hours >= 12 ? 'pm' : 'am'
      // Show minutes only if not :00
      if (minutes === 0) {
        timeLabel = `${displayHour}:00${ampm}`
      } else {
        timeLabel = `${displayHour}:${minutes.toString().padStart(2, '0')}${ampm}`
      }
    } else {
      timeLabel = `${month + 1}/${day}`
    }
    
    return {
      time: timeLabel,
      voltage: voltage,
      timestamp: timestamp,
    }
  })
}

export function VoltageChart({ data, title = "Voltage Monitor" }: VoltageChartProps) {
  const [timePeriod, setTimePeriod] = React.useState<TimePeriod>("hour")
  
  const chartConfig = React.useMemo(() => {
    const colors: Record<TimePeriod, string> = {
      hour: "var(--chart-1)",
      "24hours": "var(--chart-2)",
      week: "var(--chart-3)", // Keep for type safety, but not shown in UI
    }
    return {
      voltage: {
        label: "Voltage",
        color: colors[timePeriod],
      },
    } satisfies ChartConfig
  }, [timePeriod])
  
  // Use provided data or generate mock data
  const chartData = React.useMemo(() => {
    if (data) {
      return data
    }
    return generateVoltageData(timePeriod)
  }, [data, timePeriod])
  
  // Calculate ticks based on time period
  const xAxisTicks = React.useMemo(() => {
    if (timePeriod === "hour") {
      return chartData
        .map((d, i) => ({ time: d.time, index: i }))
        .filter((_, i) => i % 10 === 0 || i === chartData.length - 1)
        .map(d => d.time)
    } else if (timePeriod === "24hours") {
      // Show ticks every 2 hours (8 data points = 8 * 15 minutes = 2 hours)
      return chartData
        .map((d, i) => ({ time: d.time, index: i }))
        .filter((_, i) => i % 8 === 0 || i === chartData.length - 1)
        .map(d => d.time)
    } else {
      return chartData.map(d => d.time)
    }
  }, [chartData, timePeriod])
  
  const periodLabels = {
    hour: "Last Hour",
    "24hours": "Last 24 Hours",
    week: "Last Week",
  }
  
  const descriptionText = {
    hour: "Last hour of voltage data",
    "24hours": "Last 24 hours of voltage data",
    week: "Last week of voltage data",
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {descriptionText[timePeriod]}
          </CardDescription>
        </div>
        <div className="flex">
          {(["hour", "24hours"] as TimePeriod[]).map((period) => (
              <button
              key={period}
              data-active={timePeriod === period}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-muted/30 transition-colors"
              onClick={() => setTimePeriod(period)}
              >
                <span className="text-muted-foreground text-xs">
                {periodLabels[period]}
                </span>
              </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={xAxisTicks}
              tickFormatter={(value) => {
                if (timePeriod === "week") {
                  return value
                }
                // For 24hours, value is already formatted (e.g., "2:00pm" or "2:15pm")
                if (timePeriod === "24hours") {
                  return value
                }
                // For hour, format as time
                if (value.includes(':')) {
                  const [hours, minutes] = value.split(':').map(Number)
                  const hour = hours
                  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                  const ampm = hour >= 12 ? 'pm' : 'am'
                  return `${displayHour}:${minutes.toString().padStart(2, '0')}${ampm}`
                }
                return value
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `${value}V`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    if (timePeriod === "week") {
                      return `Date: ${value}`
                    }
                    // For 24hours, value is already formatted
                    if (timePeriod === "24hours") {
                      return `Time: ${value}`
                    }
                    // For hour, format as time
                    if (value.includes(':')) {
                      const [hours, minutes] = value.split(':').map(Number)
                      const hour = hours
                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                      const ampm = hour >= 12 ? 'pm' : 'am'
                      return `Time: ${displayHour}:${minutes.toString().padStart(2, '0')}${ampm}`
                    }
                    return `Time: ${value}`
                  }}
                  formatter={(value) => {
                    return [`${value}V`, "Voltage"]
                  }}
                />
              }
            />
            <Line
              dataKey="voltage"
              type="monotone"
              stroke="var(--color-voltage)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

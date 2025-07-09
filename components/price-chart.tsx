"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTheme } from "next-themes"

interface PriceChartProps {
  data: Array<{
    time: string
    price: number
    volume: number
  }>
}

const chartConfig = {
  price: {
    label: "Price",
    color: "#3b82f6", // Blue color
  },
}

export function PriceChart({ data }: PriceChartProps) {
  const { theme } = useTheme()

  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart data...</div>
  }

  const minPrice = Math.min(...data.map((d) => d.price))
  const maxPrice = Math.max(...data.map((d) => d.price))
  const padding = (maxPrice - minPrice) * 0.05

  // Dynamic colors based on theme
  const strokeColor = theme === "light" ? "#3b82f6" : "#60a5fa"
  const gridColor = theme === "light" ? "#e5e7eb" : "#374151"
  const textColor = theme === "light" ? "#6b7280" : "#9ca3af"

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.3} />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            domain={[minPrice - padding, maxPrice + padding]}
            tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [`$${Number(value).toLocaleString()}`, "Bitcoin Price"]}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#priceGradient)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

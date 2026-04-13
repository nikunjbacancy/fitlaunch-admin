import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { cn } from '@/lib/utils'

export type StatCardChartType = 'area' | 'bar' | 'line' | 'bar-thin'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    label: string
  }
  sparklineData?: number[]
  chartType?: StatCardChartType
  isLoading?: boolean
  variant?: 'default' | 'alert'
}

export function StatCard({
  title,
  value,
  trend,
  description,
  icon,
  sparklineData,
  chartType = 'area',
  isLoading,
  variant = 'default',
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="h-[172px] animate-pulse rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]" />
    )
  }

  const hasPositiveTrend = trend ? trend.value >= 0 : null
  const isAlert = variant === 'alert'

  const sparkStroke = isAlert ? '#9a292c' : '#192640'
  const sparkFill = isAlert ? '#9a292c' : '#7ca3d1'

  const sparkId = `spark-${title.toLowerCase().replace(/\W+/g, '-')}`
  const sparklinePoints = (sparklineData ?? []).map((v, i) => ({ i, v }))

  const avg =
    sparklinePoints.length > 0
      ? sparklinePoints.reduce((s, p) => s + p.v, 0) / sparklinePoints.length
      : 0

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]',
        isAlert ? 'burgundy-glow' : 'glass-glow'
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col p-6 pb-3">
        {/* Icon + title row */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/50">
              {title}
            </p>
            <p className="mt-1 text-3xl font-black tracking-tighter text-kmvmt-navy">{value}</p>
          </div>
          {icon && (
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                isAlert
                  ? 'bg-kmvmt-burgundy/10 text-kmvmt-burgundy'
                  : 'bg-kmvmt-navy/10 text-kmvmt-navy'
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {description && <p className="text-[11px] text-kmvmt-navy/40">{description}</p>}

        {trend && (
          <p
            className={cn(
              'mt-3 flex items-center gap-1 text-xs font-bold uppercase',
              hasPositiveTrend ? 'text-emerald-600' : 'text-kmvmt-red-light'
            )}
          >
            {hasPositiveTrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value > 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </p>
        )}
      </div>

      {/* Chart — with slight bottom margin */}
      {sparklinePoints.length > 0 && (
        <div className="relative z-10 mx-1 mb-3 h-20 w-auto">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={sparklinePoints}
                margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
                barCategoryGap="22%"
              >
                <Bar
                  dataKey="v"
                  fill={sparkStroke}
                  fillOpacity={0.55}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : chartType === 'bar-thin' ? (
              <BarChart
                data={sparklinePoints}
                margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
                barCategoryGap="38%"
              >
                <Bar
                  dataKey="v"
                  fill={sparkFill}
                  fillOpacity={0.75}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={10}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={sparklinePoints} margin={{ top: 6, right: 12, bottom: 6, left: 12 }}>
                <ReferenceLine y={avg} stroke="#e4e4e7" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={sparkStroke}
                  strokeWidth={2.5}
                  dot={{ fill: sparkStroke, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={sparklinePoints} margin={{ top: 6, right: 0, bottom: 4, left: 0 }}>
                <defs>
                  <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparkStroke} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={sparkStroke} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={sparkStroke}
                  strokeWidth={2.5}
                  fill={`url(#${sparkId})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

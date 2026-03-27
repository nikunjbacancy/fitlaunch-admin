import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    label: string
  }
  isLoading?: boolean
}

export function StatCard({ title, value, description, icon, trend, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-kmvmt-navy/60">{title}</p>
          {icon && <div className="text-kmvmt-navy/40">{icon}</div>}
        </div>
        <p className="text-3xl font-bold text-kmvmt-navy mt-2">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={cn(
                'flex items-center text-xs font-medium',
                trend.value >= 0 ? 'text-green-600' : 'text-kmvmt-red-dark'
              )}
            >
              {trend.value >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend.value)}% {trend.label}
            </span>
          )}
          {description && <p className="text-xs text-kmvmt-navy/50">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

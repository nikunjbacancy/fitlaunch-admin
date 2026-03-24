import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePlatformAnalytics } from './useAnalytics'

const FUNNEL_COLOURS = [
  'hsl(var(--primary))',
  'hsl(220 70% 50%)',
  'hsl(160 60% 45%)',
  'hsl(45 90% 50%)',
] as const

interface FunnelBarProps {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
}

function FunnelBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
}: FunnelBarProps): React.ReactElement {
  const fill = FUNNEL_COLOURS[index % FUNNEL_COLOURS.length] ?? FUNNEL_COLOURS[0]
  return <rect x={x} y={y} width={width} height={Math.max(0, height)} fill={fill} rx={4} />
}

export function SignupFunnelChart() {
  const { data, isLoading, isError, refetch } = usePlatformAnalytics()

  if (isLoading) return <SignupFunnelChartSkeleton />
  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <ErrorState
            message="Failed to load signup funnel"
            onRetry={() => {
              void refetch()
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Signup Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data?.signupFunnel ?? []}
            layout="vertical"
            margin={{ top: 4, right: 24, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
            <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="count" name="Users" shape={<FunnelBar />} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function SignupFunnelChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[260px] w-full" />
      </CardContent>
    </Card>
  )
}

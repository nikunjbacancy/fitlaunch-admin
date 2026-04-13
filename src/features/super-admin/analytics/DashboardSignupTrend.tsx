import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useSignupTrend } from './useAnalytics'

export function DashboardSignupTrend() {
  const { data, isLoading, isError, refetch } = useSignupTrend()

  const total = data?.reduce((sum, d) => sum + d.signups, 0) ?? 0

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="mb-4 h-8 w-20" />
        <Skeleton className="h-[160px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
        <ErrorState
          message="Failed to load signup trend"
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        Monthly Signups
      </p>
      <p className="mt-2 text-4xl font-black tracking-tight text-kmvmt-navy tabular-nums">
        {total.toLocaleString()}
      </p>
      <p className="mb-4 text-xs text-kmvmt-navy/40">total this year</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          barCategoryGap="15%"
          barSize={32}
        >
          <defs>
            <linearGradient id="signupBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9B1D29" stopOpacity={1} />
              <stop offset="100%" stopColor="#B52233" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} />
          <Bar
            dataKey="signups"
            name="Signups"
            fill="url(#signupBarGradient)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

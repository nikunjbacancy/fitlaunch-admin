import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'
import { PlatformMetrics } from './PlatformMetrics'
import { usePlatformAnalytics } from './useAnalytics'
import { PLAN_LABELS } from '../tenants/constants'
import type { SubscriptionPlan } from '@/types/tenant.types'

export function SuperAdminDashboardSummary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time platform health and key metrics
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/super-admin/analytics">
            Full Analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PlatformMetrics />
      <TopTenantsByMrr />
    </div>
  )
}

function TopTenantsByMrr() {
  const { data, isLoading, isError } = usePlatformAnalytics()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top 5 Tenants by MRR</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : isError || !data?.topTenantsByMrr.length ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No data available</p>
        ) : (
          <ol className="space-y-3">
            {data.topTenantsByMrr.map((tenant, index) => (
              <li key={tenant.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-muted-foreground tabular-nums w-4 shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      to={`/super-admin/tenants/${tenant.id}`}
                      className="text-sm font-medium hover:underline truncate block"
                    >
                      {tenant.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{tenant.tenantType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {PLAN_LABELS[tenant.plan as SubscriptionPlan]}
                  </Badge>
                  <span className="text-sm font-medium tabular-nums">
                    ${tenant.mrr.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

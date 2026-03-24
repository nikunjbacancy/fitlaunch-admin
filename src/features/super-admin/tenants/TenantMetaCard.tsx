import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeStatus } from '@/components/shared/StatusBadge'
import { Building2 } from 'lucide-react'
import { PLAN_LABELS, TENANT_TYPE_LABELS, PLAN_BADGE_CLASSES, TENANT_COPY } from './constants'
import type { Tenant } from '@/types/tenant.types'

interface TenantMetaCardProps {
  tenant: Tenant
}

export function TenantMetaCard({ tenant }: TenantMetaCardProps) {
  const planClass = PLAN_BADGE_CLASSES[tenant.plan] ?? PLAN_BADGE_CLASSES.starter

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {tenant.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={`${tenant.name} logo`}
              className="h-14 w-14 rounded-lg object-cover border"
            />
          ) : (
            <div
              className="h-14 w-14 rounded-lg border flex items-center justify-center"
              style={{ backgroundColor: tenant.primaryColor + '20' }}
            >
              <Building2 className="h-7 w-7" style={{ color: tenant.primaryColor }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl truncate">{tenant.name}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{tenant.appDisplayName}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={tenant.status as BadgeStatus} />
              <Badge variant="outline">{TENANT_TYPE_LABELS[tenant.tenantType]}</Badge>
              <Badge variant="outline" className={planClass}>
                {PLAN_LABELS[tenant.plan]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 text-sm">
          <div>
            <dt className="text-muted-foreground">{TENANT_COPY.META_MEMBERS}</dt>
            <dd className="font-medium tabular-nums">{tenant.memberCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{TENANT_COPY.META_MRR}</dt>
            <dd className="font-medium tabular-nums">${tenant.mrr.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{TENANT_COPY.META_CREATED}</dt>
            <dd className="font-medium">{new Date(tenant.createdAt).toLocaleDateString()}</dd>
          </div>
          {tenant.trialEndsAt && (
            <div>
              <dt className="text-muted-foreground">{TENANT_COPY.META_TRIAL_ENDS}</dt>
              <dd className="font-medium">{new Date(tenant.trialEndsAt).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
        <div className="mt-3 flex gap-3 pt-3 border-t">
          <span
            className="inline-block h-4 w-4 rounded-full border"
            style={{ backgroundColor: tenant.primaryColor }}
            title={TENANT_COPY.META_PRIMARY_COLOR}
          />
          <span
            className="inline-block h-4 w-4 rounded-full border"
            style={{ backgroundColor: tenant.secondaryColor }}
            title={TENANT_COPY.META_SECONDARY_COLOR}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function TenantMetaCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

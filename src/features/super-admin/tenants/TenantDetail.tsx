import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorState } from '@/components/shared/ErrorState'
import { ArrowLeft } from 'lucide-react'
import { useTenantDetail } from './useTenantDetail'
import { TenantMetaCard, TenantMetaCardSkeleton } from './TenantMetaCard'
import { TenantStatusActions } from './TenantStatusActions'
import { TENANT_COPY, TENANT_STATUS_DESCRIPTIONS, TENANT_TRIAL_DESCRIPTION } from './constants'

export function TenantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: tenant, isLoading, isError, refetch } = useTenantDetail(id ?? '')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void navigate('/super-admin/tenants')
          }}
          aria-label={TENANT_COPY.ARIA_BACK}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {TENANT_COPY.PAGE_TITLE}
        </Button>
      </div>

      {isLoading ? (
        <TenantMetaCardSkeleton />
      ) : isError || !tenant ? (
        <ErrorState
          message={TENANT_COPY.ERROR_LOAD_DETAIL}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : (
        <>
          <TenantMetaCard tenant={tenant} />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{TENANT_COPY.DETAIL_STATUS_SECTION}</CardTitle>
                <TenantStatusActions tenantId={tenant.id} currentStatus={tenant.status} />
              </div>
            </CardHeader>
            <CardContent>
              <StatusDescription status={tenant.status} trialEndsAt={tenant.trialEndsAt} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// ── private helper ───────────────────────────────────────────────────────────

interface StatusDescriptionProps {
  status: string
  trialEndsAt: string | null
}

function StatusDescription({ status, trialEndsAt }: StatusDescriptionProps) {
  const text =
    status === 'trial'
      ? TENANT_TRIAL_DESCRIPTION(trialEndsAt)
      : (TENANT_STATUS_DESCRIPTIONS[status] ?? TENANT_STATUS_DESCRIPTIONS.unknown)

  return <p className="text-sm text-muted-foreground">{text}</p>
}

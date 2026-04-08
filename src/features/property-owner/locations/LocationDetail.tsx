import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Home, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { useLocationDetail } from './useLocations'
import { LOCATIONS_COPY } from './constants'

export function LocationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: location, isLoading, isError, refetch } = useLocationDetail(id ?? '')

  if (isError) {
    return (
      <ErrorState
        title={LOCATIONS_COPY.DETAIL_ERROR}
        description={LOCATIONS_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (isLoading) {
    return <DataTableSkeleton columns={4} rows={3} />
  }

  if (!location) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Back button + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-kmvmt-navy hover:bg-kmvmt-bg"
          onClick={() => {
            void navigate('/property-owner/locations')
          }}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {LOCATIONS_COPY.DETAIL_BACK}
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-kmvmt-navy">
          {location.appDisplayName ?? location.name}
        </h1>
        <p className="text-sm text-kmvmt-navy/50">{LOCATIONS_COPY.DETAIL_TITLE}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Units"
          value={String(location.unitCount)}
          icon={<Home className="h-4 w-4" />}
        />
        <StatCard
          title="Members"
          value={String(location.memberCount)}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="MRR"
          value={`$${String(location.mrr)}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Managers"
          value={String(location.propertyManagers.length)}
          icon={<MapPin className="h-4 w-4" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-kmvmt-bg">
          <TabsTrigger value="overview">{LOCATIONS_COPY.DETAIL_TAB_OVERVIEW}</TabsTrigger>
          <TabsTrigger value="managers">{LOCATIONS_COPY.DETAIL_TAB_MANAGERS}</TabsTrigger>
          <TabsTrigger value="branding">{LOCATIONS_COPY.DETAIL_TAB_BRANDING}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-kmvmt-white p-6">
            <h3 className="mb-3 text-sm font-semibold text-kmvmt-navy">Location Info</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-kmvmt-navy/50">Status</dt>
                <dd className="font-medium text-kmvmt-navy">{location.status}</dd>
              </div>
              <div>
                <dt className="text-kmvmt-navy/50">Price per Unit</dt>
                <dd className="font-medium text-kmvmt-navy">${location.pricePerUnit}/mo</dd>
              </div>
              <div>
                <dt className="text-kmvmt-navy/50">Created</dt>
                <dd className="font-medium text-kmvmt-navy">
                  {location.createdAt ? new Date(location.createdAt).toLocaleDateString() : '—'}
                </dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="managers" className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-kmvmt-white p-6">
            <h3 className="mb-3 text-sm font-semibold text-kmvmt-navy">Property Managers</h3>
            {location.propertyManagers.length === 0 ? (
              <p className="text-sm text-kmvmt-navy/50">No managers assigned yet.</p>
            ) : (
              <ul className="space-y-2">
                {location.propertyManagers.map((pm) => (
                  <li
                    key={pm.id}
                    className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-kmvmt-navy">{pm.fullName}</p>
                      <p className="text-xs text-kmvmt-navy/50">{pm.email}</p>
                    </div>
                    <span className="text-xs text-kmvmt-navy/50">{pm.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-kmvmt-white p-6">
            <h3 className="mb-3 text-sm font-semibold text-kmvmt-navy">Branding</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-kmvmt-navy/50">App Display Name</dt>
                <dd className="font-medium text-kmvmt-navy">{location.appDisplayName ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-kmvmt-navy/50">Primary Color</dt>
                <dd className="flex items-center gap-2 font-medium text-kmvmt-navy">
                  {location.primaryColor ? (
                    <>
                      <span
                        className="inline-block h-4 w-4 rounded border border-zinc-200"
                        style={{ backgroundColor: location.primaryColor }}
                      />
                      {location.primaryColor}
                    </>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

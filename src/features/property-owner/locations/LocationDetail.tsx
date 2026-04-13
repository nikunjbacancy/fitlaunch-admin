import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Home, DollarSign } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    <div className="space-y-8">
      {/* Back + title */}
      <div>
        <button
          type="button"
          onClick={() => {
            void navigate('/property-owner/locations')
          }}
          className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {LOCATIONS_COPY.DETAIL_BACK}
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
          {location.appDisplayName ?? location.name}
        </h1>
        <p className="mt-1 text-sm text-kmvmt-navy/50">{LOCATIONS_COPY.DETAIL_TITLE}</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Units', value: String(location.unitCount), icon: <Home className="h-4 w-4" /> },
          {
            label: 'Members',
            value: String(location.memberCount),
            icon: <Users className="h-4 w-4" />,
          },
          {
            label: 'MRR',
            value: `$${String(location.mrr)}`,
            icon: <DollarSign className="h-4 w-4" />,
          },
          {
            label: 'Managers',
            value: String(location.propertyManagers.length),
            icon: <MapPin className="h-4 w-4" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col rounded-xl bg-kmvmt-white p-6 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/50">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-black tracking-tighter text-kmvmt-navy">
                  {stat.value}
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-kmvmt-navy/10 text-kmvmt-navy">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-10 rounded-xl bg-kmvmt-bg p-1">
          <TabsTrigger
            value="overview"
            className="rounded-lg px-5 text-sm font-semibold text-kmvmt-navy/60 transition-all data-[state=active]:bg-kmvmt-white data-[state=active]:font-bold data-[state=active]:text-kmvmt-navy data-[state=active]:shadow-sm"
          >
            {LOCATIONS_COPY.DETAIL_TAB_OVERVIEW}
          </TabsTrigger>
          <TabsTrigger
            value="managers"
            className="rounded-lg px-5 text-sm font-semibold text-kmvmt-navy/60 transition-all data-[state=active]:bg-kmvmt-white data-[state=active]:font-bold data-[state=active]:text-kmvmt-navy data-[state=active]:shadow-sm"
          >
            {LOCATIONS_COPY.DETAIL_TAB_MANAGERS}
          </TabsTrigger>
          <TabsTrigger
            value="branding"
            className="rounded-lg px-5 text-sm font-semibold text-kmvmt-navy/60 transition-all data-[state=active]:bg-kmvmt-white data-[state=active]:font-bold data-[state=active]:text-kmvmt-navy data-[state=active]:shadow-sm"
          >
            {LOCATIONS_COPY.DETAIL_TAB_BRANDING}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
            <div className="px-8 py-6">
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                Location Info
              </h4>
            </div>
            <div className="border-t border-zinc-50 px-8 pb-8 pt-6">
              <dl className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                    Status
                  </dt>
                  <dd className="mt-1 font-semibold text-kmvmt-navy capitalize">
                    {location.status}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                    Price per Unit
                  </dt>
                  <dd className="mt-1 font-semibold text-kmvmt-navy">
                    ${location.pricePerUnit}/mo
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                    Created
                  </dt>
                  <dd className="mt-1 font-semibold text-kmvmt-navy">
                    {location.createdAt ? new Date(location.createdAt).toLocaleDateString() : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="managers">
          <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
            <div className="px-8 py-6">
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                Property Managers
              </h4>
            </div>
            <div className="border-t border-zinc-50 px-8 pb-8 pt-4">
              {location.propertyManagers.length === 0 ? (
                <p className="py-4 text-sm text-kmvmt-navy/50">No managers assigned yet.</p>
              ) : (
                <ul className="space-y-3">
                  {location.propertyManagers.map((pm) => (
                    <li
                      key={pm.id}
                      className="flex items-center justify-between rounded-xl bg-kmvmt-bg px-5 py-3.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-kmvmt-navy">{pm.fullName}</p>
                        <p className="text-xs text-kmvmt-navy/50">{pm.email}</p>
                      </div>
                      <span className="text-[11px] font-bold capitalize text-kmvmt-navy/40">
                        {pm.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
            <div className="px-8 py-6">
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">Branding</h4>
            </div>
            <div className="border-t border-zinc-50 px-8 pb-8 pt-6">
              <dl className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                    App Display Name
                  </dt>
                  <dd className="mt-1 font-semibold text-kmvmt-navy">
                    {location.appDisplayName ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-black uppercase tracking-widest text-kmvmt-navy/50">
                    Primary Color
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 font-semibold text-kmvmt-navy">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Download, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlatformAnalytics } from './useAnalytics'

const PLAN_TIER: Record<string, { label: string; className: string }> = {
  pro: { label: 'Elite Tier', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  growth: { label: 'Professional', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  starter: { label: 'Starter', className: 'bg-slate-50 text-slate-600 border-slate-200' },
  per_unit: { label: 'Per Unit', className: 'bg-teal-50 text-teal-700 border-teal-200' },
}

export function TopTenantsByMrrTable() {
  const { data, isLoading, isError } = usePlatformAnalytics()

  return (
    <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-7">
        <div>
          <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
            Top Tenants by MRR
          </h4>
          <p className="mt-1 text-sm text-kmvmt-navy/50">Elite Tier Performance</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95">
          <Download className="h-3.5 w-3.5" />
          Full Report
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="px-8 pb-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : isError || !data?.topTenantsByMrr.length ? (
        <p className="py-10 text-center text-sm text-kmvmt-navy/40">No data available</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-kmvmt-bg/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    Tenant Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    Type
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    Status
                  </th>
                  <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    MRR Contribution
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.topTenantsByMrr.map((tenant, index) => {
                  const initials = tenant.name
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
                  const tier = PLAN_TIER[tenant.plan] ?? PLAN_TIER.starter
                  const isApartment = tenant.tenantType === 'apartment'

                  return (
                    <tr key={tenant.id} className="transition-colors hover:bg-kmvmt-bg/30">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${isApartment ? 'bg-kmvmt-navy' : 'bg-kmvmt-burgundy'}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <Link
                              to={`/super-admin/tenants/${tenant.id}`}
                              className="text-sm font-bold text-kmvmt-navy transition-colors hover:text-kmvmt-blue-light"
                            >
                              {tenant.name}
                            </Link>
                            <p className="text-[11px] text-kmvmt-navy/40">#{index + 1} ranked</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm capitalize text-kmvmt-navy/60">
                        {tenant.tenantType === 'apartment' ? 'Apartment' : 'Trainer/Gym'}
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${tier.className}`}
                        >
                          {tier.label}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-right text-sm font-bold tabular-nums text-kmvmt-navy">
                        ${tenant.mrr.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center border-t border-zinc-50 px-8 py-5">
            <Link
              to="/super-admin/tenants"
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
            >
              View all tenants
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

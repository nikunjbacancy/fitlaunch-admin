import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Dumbbell, LayoutGrid } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useOnboardingQueue } from '../onboarding/useOnboardingQueue'
import { DASHBOARD_COPY } from './dashboard.constants'
import type { BusinessType } from '../onboarding/onboarding.types'
import type { LucideIcon } from 'lucide-react'

const BUSINESS_TYPE_ICONS: Record<BusinessType, LucideIcon> = {
  apartment: Building2,
  personal_trainer: Dumbbell,
  nutritionist: LayoutGrid,
  gym: Dumbbell,
  online_coach: LayoutGrid,
  crossfit_box: Dumbbell,
}

const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  personal_trainer: 'Personal Trainer',
  nutritionist: 'Nutritionist',
  gym: 'Gym',
  online_coach: 'Online Coach',
  crossfit_box: 'CrossFit Box',
  apartment: 'Apartment Community',
}

const ONBOARDING_PHASES = ['Invite', 'Profile', 'Payment', 'Launch'] as const

export function DashboardOnboardingPreview() {
  const { data, isLoading } = useOnboardingQueue('pending', 1)
  const items = (data?.data ?? []).slice(0, 3)
  const totalPending = data?.meta.total ?? 0

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {DASHBOARD_COPY.SECTION_ONBOARDING}
          </p>
          {totalPending > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
              {DASHBOARD_COPY.ONBOARDING_COUNT.replace('{n}', String(totalPending))}
            </span>
          )}
        </div>
        <Link
          to="/super-admin/onboarding"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {DASHBOARD_COPY.BTN_VIEW_ONBOARDING}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-xs text-kmvmt-navy/40">
            {DASHBOARD_COPY.ONBOARDING_EMPTY}
          </p>
        ) : (
          <div>
            {items.map((app, idx) => {
              const Icon = BUSINESS_TYPE_ICONS[app.businessType]
              // Simulate phase 1–4 based on index for visual variety
              const phase = (idx % 4) + 1
              const phaseWidth = `${String((phase / ONBOARDING_PHASES.length) * 100)}%`

              return (
                <div
                  key={app.id}
                  className="flex items-center gap-4 px-2 py-4 transition-colors hover:bg-kmvmt-bg/50 rounded-xl"
                >
                  {/* Icon tile */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-kmvmt-navy">{app.tenantName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                      {BUSINESS_TYPE_LABELS[app.businessType]}
                    </p>
                  </div>

                  {/* Phase progress */}
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-kmvmt-burgundy">
                      Phase {phase}/{ONBOARDING_PHASES.length}
                    </p>
                    <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-kmvmt-bg">
                      <div
                        className="h-full rounded-full bg-kmvmt-burgundy transition-all duration-300"
                        style={{ width: phaseWidth }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

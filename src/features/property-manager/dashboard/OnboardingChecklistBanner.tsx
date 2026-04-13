import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Palette, Home } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useUnitSummary } from '@/features/property-manager/units/useUnits'
import { cn } from '@/lib/utils'
import {
  BRANDING_COMPLETED_STEPS,
  CHECKLIST_ROUTES,
  DASHBOARD_COPY,
  ONBOARDING_ACTIVE_STEP,
} from './constants'

interface ChecklistItem {
  key: 'branding' | 'units'
  title: string
  description: string
  href: string
  icon: typeof Palette
  done: boolean
}

export function OnboardingChecklistBanner(): React.ReactElement | null {
  const tenantOnboardingStep = useAuthStore((s) => s.tenantOnboardingStep)
  const isOwnerManagedTenant = useAuthStore((s) => s.isOwnerManagedTenant)
  // Owner-managed PMs don't own branding or units; owner handles both.
  // Skip the unit-summary query entirely for them so we don't waste a request.
  const { data: unitSummary } = useUnitSummary()

  // Owner-managed PMs: banner never applies
  if (isOwnerManagedTenant) {
    return null
  }

  // Pre-hydration (e.g. during first render before /login response lands)
  if (tenantOnboardingStep === null) {
    return null
  }

  // Per-item completion is evidence-based (backend decision):
  // - units: unit summary exposes `added` count — unambiguous signal
  // - branding: the PATCH /tenants/:id/branding response advances the step to
  //   `branding_complete` (or `active` once units also exist), so the step enum
  //   is a reliable branding signal even when units were added first
  const isActive = tenantOnboardingStep === ONBOARDING_ACTIVE_STEP
  const brandingDone =
    isActive || (BRANDING_COMPLETED_STEPS as readonly string[]).includes(tenantOnboardingStep)
  const unitsDone = isActive || (unitSummary?.added ?? 0) > 0

  // Hide only when both evidence checks pass. Do NOT rely on step === 'active'
  // alone — a PM who adds units before branding stays at 'password_set' until
  // both exist, so an ordinal check would leave the banner stuck forever.
  if (brandingDone && unitsDone) {
    return null
  }

  const items: ChecklistItem[] = [
    {
      key: 'branding',
      title: DASHBOARD_COPY.CHECKLIST_BRANDING_TITLE,
      description: DASHBOARD_COPY.CHECKLIST_BRANDING_DESC,
      href: CHECKLIST_ROUTES.BRANDING,
      icon: Palette,
      done: brandingDone,
    },
    {
      key: 'units',
      title: DASHBOARD_COPY.CHECKLIST_UNITS_TITLE,
      description: DASHBOARD_COPY.CHECKLIST_UNITS_DESC,
      href: CHECKLIST_ROUTES.UNITS,
      icon: Home,
      done: unitsDone,
    },
  ]

  const completed = items.filter((i) => i.done).length

  return (
    <section
      aria-label={DASHBOARD_COPY.CHECKLIST_TITLE}
      className="rounded-xl bg-kmvmt-white p-6 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-kmvmt-navy">{DASHBOARD_COPY.CHECKLIST_TITLE}</h2>
          <p className="mt-1 text-xs text-kmvmt-navy/60">{DASHBOARD_COPY.CHECKLIST_SUBTITLE}</p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
          {DASHBOARD_COPY.CHECKLIST_PROGRESS(completed, items.length)}
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item.key}
            className={cn(
              'flex items-center gap-4 rounded-xl border border-zinc-200 px-4 py-3 transition-colors',
              item.done ? 'bg-kmvmt-bg/60' : 'bg-kmvmt-white hover:border-kmvmt-navy/30'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                item.done ? 'bg-kmvmt-bg text-kmvmt-navy/50' : 'bg-kmvmt-bg text-kmvmt-navy'
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-kmvmt-navy" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-kmvmt-navy/30" aria-hidden="true" />
                )}
                <p
                  className={cn(
                    'truncate text-sm font-bold',
                    item.done ? 'text-kmvmt-navy/60 line-through' : 'text-kmvmt-navy'
                  )}
                >
                  {item.title}
                </p>
              </div>
              <p className="mt-0.5 truncate text-xs text-kmvmt-navy/50">{item.description}</p>
            </div>

            {item.done ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
                {DASHBOARD_COPY.CHECKLIST_CTA_DONE}
              </span>
            ) : (
              <Link
                to={item.href}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-kmvmt-navy px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-kmvmt-blue-light/80"
              >
                {DASHBOARD_COPY.CHECKLIST_CTA_GO}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

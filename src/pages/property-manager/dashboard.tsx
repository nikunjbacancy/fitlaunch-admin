import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CreditCard } from 'lucide-react'
import { OnboardingChecklistBanner } from '@/features/property-manager/dashboard/OnboardingChecklistBanner'
import { PmDashboardSummary } from '@/features/property-manager/dashboard/PmDashboardSummary'
import { EngagementChart } from '@/features/property-manager/dashboard/EngagementChart'
import { PendingRegistrationsFeed } from '@/features/property-manager/dashboard/PendingRegistrationsFeed'
import { RecentCommunityFeed } from '@/features/property-manager/dashboard/RecentCommunityFeed'
import { ActiveChallengesCard } from '@/features/property-manager/dashboard/ActiveChallengesCard'
import { DASHBOARD_COPY } from '@/features/property-manager/dashboard/constants'

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="space-y-10">
      {/* Page header — mirrors Super Admin dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-kmvmt-navy">
            {DASHBOARD_COPY.PAGE_TITLE}
          </h1>
          <p className="mt-0.5 text-xs text-kmvmt-navy/40">{DASHBOARD_COPY.PAGE_DESCRIPTION}</p>
        </div>
      </div>

      {/* Onboarding checklist — self-hides once branding + units are complete */}
      <OnboardingChecklistBanner />

      {/* KPI cards — 4 across */}
      <PmDashboardSummary />

      {/* Charts row — engagement chart (2/3) + subscription panel (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>
        <SubscriptionStatusPanel />
      </div>

      {/* Bottom row — pending registrations + recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PendingRegistrationsFeed />
        <RecentCommunityFeed />
      </div>

      {/* Active challenges — full width */}
      <ActiveChallengesCard />
    </div>
  )
}

function SubscriptionStatusPanel(): React.ReactElement {
  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {DASHBOARD_COPY.SUBSCRIPTION_TITLE}
          </p>
          <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
            Pro plan
          </span>
        </div>
        <Link
          to="/property-manager/billing"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {DASHBOARD_COPY.SUBSCRIPTION_MANAGE}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Detail rows */}
      <div className="flex-1 px-4 pb-4">
        <div className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-kmvmt-navy">•••• 4242</p>
            <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
              Payment method
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-kmvmt-navy">May 1, 2026</p>
            <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
              Next billing date
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

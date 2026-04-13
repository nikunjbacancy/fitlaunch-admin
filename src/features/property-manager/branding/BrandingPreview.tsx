import {
  Bell,
  Dumbbell,
  Home,
  Sparkles,
  TrendingUp,
  User,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRANDING_COPY } from './constants'

interface BrandingPreviewProps {
  primaryColor: string
  secondaryColor: string
  appName: string
  logoPreview: string | null
}

export function BrandingPreview({
  primaryColor,
  secondaryColor,
  appName,
  logoPreview,
}: BrandingPreviewProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/40">
        {BRANDING_COPY.PREVIEW_TITLE}
      </p>
      <p className="mb-4 max-w-[220px] text-center text-[10px] text-kmvmt-navy/40">
        {BRANDING_COPY.PREVIEW_SUBTITLE}
      </p>
      <PhoneMockup
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        appName={appName}
        logoPreview={logoPreview}
      />
    </div>
  )
}

function PhoneMockup({
  primaryColor,
  secondaryColor,
  appName,
  logoPreview,
}: BrandingPreviewProps): React.ReactElement {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[52px] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl"
      style={{ width: 360, height: 740 }}
    >
      {/* Dynamic island */}
      <div className="absolute left-1/2 top-[12px] z-20 h-[12px] w-[68px] -translate-x-1/2 rounded-full bg-zinc-900" />

      {/* Status bar */}
      <div
        className="flex flex-shrink-0 items-center justify-between px-5 pb-1.5 pt-4"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="text-[11px] font-semibold text-white">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-end gap-px">
            {[3, 4, 5, 6].map((h, i) => (
              <div key={i} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />
            ))}
          </div>
          <div className="flex h-[11px] w-[18px] items-center rounded-[2px] border border-white/60 p-px">
            <div className="h-full w-3/4 rounded-sm bg-white" />
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {logoPreview ? (
              <img src={logoPreview} alt="logo" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <User className="h-5 w-5 text-white/60" aria-hidden="true" />
              </div>
            )}
            <div>
              <p className="text-[9px] uppercase tracking-wide text-white/50">Hi Welcome</p>
              <p className="text-[13px] font-bold leading-tight text-white">
                {appName || 'Your App Name'}
              </p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Bell className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-4 gap-2">
          {(
            [
              { icon: Dumbbell, label: 'Workout' },
              { icon: UtensilsCrossed, label: 'Meal' },
              { icon: Sparkles, label: 'AI Coach' },
              { icon: TrendingUp, label: 'Progress' },
            ] as const
          ).map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl bg-white/10 py-2.5"
            >
              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="text-[9px] font-medium text-white/80">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-hidden bg-zinc-50 pb-[64px]">
        <div
          className="mx-3 mt-3 overflow-hidden rounded-xl p-3.5"
          style={{ backgroundColor: primaryColor }}
        >
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
            style={{ backgroundColor: secondaryColor }}
          >
            TODAY&#39;S PLAN
          </span>
          <p className="mt-1 text-[13px] font-bold text-white">HIIT Fat Burner</p>
          <p className="text-[10px] text-white/70">350 kcal · 45 min</p>
        </div>

        <div className="mx-3 mt-2.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-zinc-100 bg-white p-3">
            <p className="text-[9px] text-zinc-400">Weekly Activity</p>
            <p className="mt-1 text-[13px] font-bold text-zinc-800">3 / 5 days</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full w-3/5 rounded-full transition-all"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-white p-3">
            <p className="text-[9px] text-zinc-400">Calories</p>
            <p className="mt-1 text-[13px] font-bold text-zinc-800">1,548 kcal</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full w-2/5 rounded-full transition-all"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
          </div>
        </div>

        <div className="mx-3 mt-2.5 rounded-xl p-3.5" style={{ backgroundColor: primaryColor }}>
          <p className="text-[9px] uppercase tracking-wide text-white/60">Active Challenge</p>
          <p className="mt-1 text-[12px] font-bold text-white">Summer Shred 30-Day</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full w-[46%] rounded-full transition-all"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </div>

      {/* Bottom tab bar — primary color background, active pill is white */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2.5 py-2.5"
        style={{ backgroundColor: primaryColor }}
      >
        {(
          [
            { icon: Home, label: 'Home', active: false },
            { icon: Dumbbell, label: 'Workouts', active: true },
            { icon: UtensilsCrossed, label: 'Nutrition', active: false },
            { icon: Users, label: 'Community', active: false },
            { icon: User, label: 'Profile', active: false },
          ] as const
        ).map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors',
              active && 'bg-white shadow-sm'
            )}
          >
            <Icon
              className={cn('h-5 w-5', active ? 'text-kmvmt-navy' : 'text-white')}
              aria-hidden="true"
            />
            <span
              className={cn('text-[10px] font-semibold', active ? 'text-kmvmt-navy' : 'text-white')}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

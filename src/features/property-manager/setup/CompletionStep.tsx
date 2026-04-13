import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useCompleteOnboarding } from './useSetup'
import { SETUP_COPY } from './setup.constants'

const CONFETTI_PARTICLES = [
  { left: '8%', delay: '0ms', color: 'bg-kmvmt-blue-light' },
  { left: '18%', delay: '80ms', color: 'bg-kmvmt-navy' },
  { left: '28%', delay: '160ms', color: 'bg-kmvmt-blue-light' },
  { left: '38%', delay: '40ms', color: 'bg-kmvmt-navy' },
  { left: '48%', delay: '200ms', color: 'bg-kmvmt-blue-light' },
  { left: '58%', delay: '120ms', color: 'bg-kmvmt-navy' },
  { left: '68%', delay: '60ms', color: 'bg-kmvmt-blue-light' },
  { left: '78%', delay: '180ms', color: 'bg-kmvmt-navy' },
  { left: '88%', delay: '100ms', color: 'bg-kmvmt-blue-light' },
  { left: '13%', delay: '20ms', color: 'bg-kmvmt-navy' },
  { left: '53%', delay: '140ms', color: 'bg-kmvmt-blue-light' },
  { left: '73%', delay: '240ms', color: 'bg-kmvmt-navy' },
] as const

interface CompletionStepProps {
  brandName: string
  unitCount: number
}

export function CompletionStep({ brandName, unitCount }: CompletionStepProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const completeOnboarding = useCompleteOnboarding()
  const [showConfetti] = useState(true)

  useEffect(() => {
    // Confetti particles animate on mount via CSS keyframes and fade out naturally
  }, [])

  const handleGoToDashboard = (): void => {
    completeOnboarding.mutate(user?.tenantId ?? '', {
      onSuccess: () => {
        void navigate('/dashboard', { replace: true })
      },
    })
  }

  const summaryRows = [
    { label: SETUP_COPY.COMPLETE_SUMMARY_COMPLEX, value: user?.tenantName ?? null },
    { label: SETUP_COPY.COMPLETE_SUMMARY_BRAND, value: brandName || null },
    {
      label: SETUP_COPY.COMPLETE_SUMMARY_UNITS,
      value: unitCount > 0 ? `${String(unitCount)} units` : null,
    },
  ]

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-160px) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="mx-auto max-w-xl">
        <div className="relative overflow-hidden rounded-3xl bg-kmvmt-white p-10 shadow-[0px_20px_60px_rgba(25,38,64,0.08)]">
          {/* Gradient glow — top-right */}
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.08]" />

          {/* Confetti */}
          {showConfetti && (
            <div className="pointer-events-none relative mx-auto mb-2 h-12 overflow-visible">
              {CONFETTI_PARTICLES.map((p, i) => (
                <div
                  key={i}
                  className={`absolute bottom-0 h-2 w-2 rounded-sm ${p.color}`}
                  style={{
                    left: p.left,
                    animation: 'confetti-fall 1.2s ease-out forwards',
                    animationDelay: p.delay,
                  }}
                />
              ))}
            </div>
          )}

          {/* Hero */}
          <div className="relative text-center">
            {/* Check medallion */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light shadow-[0_12px_24px_-8px_rgba(25,38,64,0.4)]">
              <Check className="h-8 w-8 text-white" strokeWidth={3} />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
              {SETUP_COPY.COMPLETE_HEADING}
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-kmvmt-navy/50">
              {SETUP_COPY.COMPLETE_SUBTITLE_NEW}
            </p>
          </div>

          {/* Summary list */}
          <div className="relative mt-8 space-y-2">
            {summaryRows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl bg-kmvmt-bg px-5 py-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-kmvmt-navy/50">
                  {label}
                </span>
                <span className="ml-auto text-sm font-bold text-kmvmt-navy">{value ?? '—'}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            disabled={completeOnboarding.isPending}
            onClick={handleGoToDashboard}
            className="relative mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {completeOnboarding.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                {SETUP_COPY.COMPLETE_CTA}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

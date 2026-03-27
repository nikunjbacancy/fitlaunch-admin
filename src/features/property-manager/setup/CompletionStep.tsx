import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useCompleteOnboarding } from './useSetup'
import { SETUP_COPY } from './setup.constants'

const CONFETTI_PARTICLES = [
  { left: '10%', delay: '0ms', color: 'bg-kmvmt-blue-light' },
  { left: '20%', delay: '80ms', color: 'bg-white' },
  { left: '30%', delay: '160ms', color: 'bg-kmvmt-blue-light' },
  { left: '40%', delay: '40ms', color: 'bg-white' },
  { left: '50%', delay: '200ms', color: 'bg-kmvmt-blue-light' },
  { left: '60%', delay: '120ms', color: 'bg-white' },
  { left: '70%', delay: '60ms', color: 'bg-kmvmt-blue-light' },
  { left: '80%', delay: '180ms', color: 'bg-white' },
  { left: '15%', delay: '100ms', color: 'bg-white' },
  { left: '35%', delay: '20ms', color: 'bg-kmvmt-blue-light' },
  { left: '55%', delay: '140ms', color: 'bg-white' },
  { left: '75%', delay: '240ms', color: 'bg-kmvmt-blue-light' },
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

  const handleGoToDashboard = () => {
    completeOnboarding.mutate(user?.tenantId ?? '', {
      onSuccess: () => {
        void navigate('/dashboard', { replace: true })
      },
    })
  }

  const summaryRows = [
    { label: SETUP_COPY.COMPLETE_SUMMARY_COMPLEX, value: user?.tenantName ?? null },
    { label: SETUP_COPY.COMPLETE_SUMMARY_BRAND, value: brandName || null },
    { label: SETUP_COPY.COMPLETE_SUMMARY_UNITS, value: unitCount > 0 ? String(unitCount) : null },
  ]

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-120px) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="text-center">
        {/* Confetti */}
        {showConfetti && (
          <div className="relative mx-auto mb-2 h-16 overflow-visible">
            {CONFETTI_PARTICLES.map((p, i) => (
              <div
                key={i}
                className={`absolute bottom-0 h-2 w-2 rounded-sm ${p.color}`}
                style={{
                  left: p.left,
                  animation: `confetti-fall 1s ease-out forwards`,
                  animationDelay: p.delay,
                }}
              />
            ))}
          </div>
        )}

        {/* Check icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-kmvmt-navy">
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-kmvmt-navy">{SETUP_COPY.COMPLETE_HEADING}</h2>
        <p className="mt-2 text-sm text-zinc-500">{SETUP_COPY.COMPLETE_SUBTITLE_NEW}</p>

        {/* Summary list */}
        <div className="mt-8 space-y-3 text-left">
          {summaryRows.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
              </div>
              <span className="text-sm text-zinc-500">{label}</span>
              <span className="ml-auto text-sm font-semibold text-kmvmt-navy">
                {value ?? '\u2014'}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          className="mt-8 h-11 w-full bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold"
          disabled={completeOnboarding.isPending}
          onClick={handleGoToDashboard}
        >
          {completeOnboarding.isPending ? 'Loading\u2026' : `${SETUP_COPY.COMPLETE_CTA} \u2192`}
        </Button>
      </div>
    </>
  )
}

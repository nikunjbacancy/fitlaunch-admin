import { Check } from 'lucide-react'
import kmvmtLogo from '@/assets/logo_bg_white.png'
import { cn } from '@/lib/utils'
import { SETUP_COPY } from './setup.constants'

interface OnboardingLeftPanelProps {
  activeStep: number
}

const STEPS = [
  {
    step: 1,
    label: SETUP_COPY.STEP_1_LABEL,
    description: SETUP_COPY.STEP_1_DESC,
  },
  {
    step: 2,
    label: SETUP_COPY.STEP_2_LABEL,
    description: SETUP_COPY.STEP_2_DESC,
  },
  {
    step: 3,
    label: SETUP_COPY.STEP_3_LABEL,
    description: SETUP_COPY.STEP_3_DESC,
  },
] as const

const TAGLINES: Record<number, string> = {
  1: SETUP_COPY.LEFT_TAGLINE_1,
  2: SETUP_COPY.LEFT_TAGLINE_2,
  3: SETUP_COPY.LEFT_TAGLINE_3,
}

export function OnboardingLeftPanel({ activeStep }: OnboardingLeftPanelProps) {
  return (
    <div className="relative flex w-full flex-col justify-between overflow-hidden bg-kmvmt-navy px-12 py-12">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kmvmt-blue-light/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-kmvmt-blue-light/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-kmvmt-blue-light/10 blur-2xl" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <img src={kmvmtLogo} alt="KMVMT" className="h-14 w-14 rounded-2xl object-contain" />
        <div>
          <p className="text-base font-bold tracking-tight text-white">KMVMT</p>
          <p className="text-[11px] font-medium uppercase tracking-widest text-kmvmt-blue-light/60">
            Workspace Setup
          </p>
        </div>
      </div>

      {/* Step tracker */}
      <div className="relative">
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.18em] text-kmvmt-blue-light/40">
          {SETUP_COPY.PAGE_TITLE}
        </p>

        <div className="flex flex-col gap-0">
          {STEPS.map((stepItem, index) => {
            const isCompleted = stepItem.step < activeStep
            const isActive = stepItem.step === activeStep
            const isUpcoming = stepItem.step > activeStep
            const isLast = index === STEPS.length - 1

            return (
              <div key={stepItem.step} className="flex items-start gap-4">
                {/* Left column: circle + connector line */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all',
                      isCompleted &&
                        'bg-white text-kmvmt-navy shadow-[0_4px_12px_rgba(255,255,255,0.2)]',
                      isActive &&
                        'bg-white text-kmvmt-navy shadow-[0_4px_16px_rgba(255,255,255,0.3)] ring-4 ring-white/10',
                      isUpcoming && 'border border-white/15 text-white/30'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-kmvmt-navy" strokeWidth={3} />
                    ) : (
                      stepItem.step
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        'my-2 w-px flex-1 transition-all',
                        isCompleted ? 'bg-white/40' : 'bg-white/10'
                      )}
                      style={{ height: 40 }}
                    />
                  )}
                </div>

                {/* Right column: label + description */}
                <div className="pb-9 pt-1">
                  <p
                    className={cn(
                      'text-sm font-bold leading-tight transition-all',
                      isActive && 'text-white',
                      isCompleted && 'text-white/60',
                      isUpcoming && 'text-white/30'
                    )}
                  >
                    {stepItem.label}
                  </p>
                  {!isUpcoming && (
                    <p className="mt-1 text-xs text-kmvmt-blue-light/50">{stepItem.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative">
        <p className="text-sm leading-relaxed text-kmvmt-blue-light/60">
          {TAGLINES[activeStep] ?? TAGLINES[1]}
        </p>
      </div>
    </div>
  )
}

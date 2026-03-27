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
    <div className="relative flex w-full flex-col justify-between overflow-hidden bg-kmvmt-navy px-10 py-10">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-kmvmt-blue-light/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-kmvmt-blue-light/15 blur-3xl" />
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
        <img src={kmvmtLogo} alt="KMVMT" className="h-12 w-12 rounded-2xl object-contain" />
        <div>
          <p className="text-base font-bold tracking-tight text-white">KMVMT</p>
          <p className="text-[11px] font-medium uppercase tracking-widest text-kmvmt-blue-light/60">
            Admin Console
          </p>
        </div>
      </div>

      {/* Step tracker */}
      <div className="relative">
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
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all',
                      isCompleted && 'bg-white text-kmvmt-navy',
                      isActive && 'bg-white text-kmvmt-navy font-bold',
                      isUpcoming && 'border border-white/20 text-white/30'
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
                        'my-1 w-px flex-1 transition-all',
                        isCompleted ? 'bg-white/40' : 'bg-white/10'
                      )}
                      style={{ height: 36 }}
                    />
                  )}
                </div>

                {/* Right column: label + description */}
                <div className="pb-8">
                  <p
                    className={cn(
                      'text-sm font-semibold leading-tight transition-all',
                      isActive && 'text-white',
                      isCompleted && 'text-white/60',
                      isUpcoming && 'text-white/30'
                    )}
                  >
                    {stepItem.label}
                  </p>
                  {!isUpcoming && (
                    <p className="mt-0.5 text-xs text-kmvmt-blue-light/50">
                      {stepItem.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative">
        <p className="text-sm text-kmvmt-blue-light/50">{TAGLINES[activeStep] ?? TAGLINES[1]}</p>
      </div>
    </div>
  )
}

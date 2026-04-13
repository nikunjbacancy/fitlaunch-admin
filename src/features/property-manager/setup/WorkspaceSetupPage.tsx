import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { BrandingStep } from './BrandingStep'
import { UnitDirectoryStep } from './UnitDirectoryStep'
import { CompletionStep } from './CompletionStep'
import { OnboardingLeftPanel } from './OnboardingLeftPanel'
import { WIZARD_STEPS, ONBOARDING_STEP_TO_WIZARD_STEP, SETUP_COPY } from './setup.constants'

export function WorkspaceSetupPage() {
  const tenantOnboardingStep = useAuthStore((s) => s.tenantOnboardingStep)

  const initialStep = ONBOARDING_STEP_TO_WIZARD_STEP[tenantOnboardingStep ?? 'invited'] ?? 1
  const [activeStep, setActiveStep] = useState(initialStep)
  const [brandName, setBrandName] = useState('')
  const [unitCount, setUnitCount] = useState(0)

  const currentWizardStep = WIZARD_STEPS.find((s) => s.step === activeStep)

  return (
    <div className="flex min-h-screen">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[40%]">
        <OnboardingLeftPanel activeStep={activeStep} />
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto bg-kmvmt-bg">
        <div className="flex min-h-full justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-4xl">
            {/* Mobile-only: step indicator pill */}
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <span className="inline-flex items-center rounded-full bg-kmvmt-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60 shadow-[0px_4px_12px_rgba(25,38,64,0.04)]">
                {SETUP_COPY.MOBILE_STEP_OF.replace('{current}', String(activeStep)).replace(
                  '{total}',
                  String(WIZARD_STEPS.length)
                )}
              </span>
              {currentWizardStep && (
                <span className="text-xs font-bold uppercase tracking-wider text-kmvmt-navy">
                  {currentWizardStep.label}
                </span>
              )}
            </div>

            {activeStep === 1 && (
              <BrandingStep
                onComplete={(name) => {
                  setBrandName(name)
                  setActiveStep(2)
                }}
              />
            )}
            {activeStep === 2 && (
              <UnitDirectoryStep
                onComplete={(count) => {
                  setUnitCount(count)
                  setActiveStep(3)
                }}
              />
            )}
            {activeStep === 3 && <CompletionStep brandName={brandName} unitCount={unitCount} />}
          </div>
        </div>
      </div>
    </div>
  )
}

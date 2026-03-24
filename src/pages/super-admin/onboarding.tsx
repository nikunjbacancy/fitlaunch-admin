import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { OnboardingQueue } from '@/features/super-admin/onboarding/OnboardingQueue'

export default function OnboardingPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Queue"
        description="Review and approve B2B tenant applications."
      />
      <OnboardingQueue />
    </div>
  )
}

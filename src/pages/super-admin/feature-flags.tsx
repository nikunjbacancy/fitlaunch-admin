import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { FeatureFlagList } from '@/features/super-admin/feature-flags/FeatureFlagList'

export default function FeatureFlagsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Flags"
        description="Enable or disable platform features. Billing-affecting flags require confirmation."
      />
      <FeatureFlagList />
    </div>
  )
}

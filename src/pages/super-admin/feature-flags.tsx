import React from 'react'
import { PageShell } from '@/components/shared/PageShell'
import { FeatureFlagList } from '@/features/super-admin/feature-flags/FeatureFlagList'

export default function FeatureFlagsPage(): React.ReactElement {
  return (
    <PageShell
      breadcrumb={['KMVMT', 'Feature Flags']}
      title="Feature Flags"
      tableTitle="Platform Configuration"
      tableActions
    >
      <FeatureFlagList />
    </PageShell>
  )
}

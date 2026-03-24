import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { SupportQueue } from '@/features/super-admin/support/SupportQueue'

export default function SupportPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Queue"
        description="Review and manage support tickets submitted by tenants."
      />
      <SupportQueue />
    </div>
  )
}

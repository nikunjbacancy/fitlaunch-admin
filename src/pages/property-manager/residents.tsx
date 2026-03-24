import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ResidentList } from '@/features/property-manager/residents/ResidentList'

export default function ResidentsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Residents"
        description="Manage residents, approve registrations, and export data."
      />
      <ResidentList />
    </div>
  )
}

import React from 'react'
import { TenantList } from '@/features/super-admin/tenants/TenantList'

export default function TrainersPage(): React.ReactElement {
  return <TenantList defaultTenantType="trainer" />
}

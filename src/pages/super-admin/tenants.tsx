import React from 'react'
import { TenantList } from '@/features/super-admin/tenants/TenantList'

export default function TenantsPage(): React.ReactElement {
  return <TenantList defaultTenantType="apartment" />
}

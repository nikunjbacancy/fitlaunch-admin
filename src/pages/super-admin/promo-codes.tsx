import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PromoCodeList } from '@/features/super-admin/billing/promo-codes/PromoCodeList'
import { CreatePromoCodeForm } from '@/features/super-admin/billing/promo-codes/CreatePromoCodeForm'

export default function PromoCodesPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Promo Codes"
        description="Create and manage discount codes for tenant subscriptions."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PromoCodeList />
        </div>
        <div>
          <CreatePromoCodeForm />
        </div>
      </div>
    </div>
  )
}

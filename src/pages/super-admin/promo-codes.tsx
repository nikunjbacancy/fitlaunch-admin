import React from 'react'
import { Plus } from 'lucide-react'
import { PageShell, PageCta } from '@/components/shared/PageShell'
import { PromoCodeList } from '@/features/super-admin/billing/promo-codes/PromoCodeList'
import { CreatePromoCodeForm } from '@/features/super-admin/billing/promo-codes/CreatePromoCodeForm'

export default function PromoCodesPage(): React.ReactElement {
  return (
    <PageShell
      breadcrumb={['KMVMT', 'Promo Codes']}
      title="Promo Codes"
      cta={<PageCta label="Create Code" icon={<Plus className="h-4 w-4" />} />}
      tableTitle="Promo Code Registry"
      tableActions
    >
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PromoCodeList />
        </div>
        <div>
          <CreatePromoCodeForm />
        </div>
      </div>
    </PageShell>
  )
}

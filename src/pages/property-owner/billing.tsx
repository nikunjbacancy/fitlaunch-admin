import React from 'react'
import { CreditCard } from 'lucide-react'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'

const PO_BILLING_COPY = {
  COMING_SOON_TITLE: 'Portfolio billing coming soon',
  COMING_SOON_DESC:
    'Centralize invoices, plans, and unit allocations across every property in your portfolio.',
  FEATURE_1_TITLE: 'Consolidated invoices',
  FEATURE_1_DESC: 'One bill covering every location, with a clean per-property breakdown.',
  FEATURE_2_TITLE: 'Allocation controls',
  FEATURE_2_DESC: 'Move unit allocation between properties as your portfolio shifts.',
  FEATURE_3_TITLE: 'Payment history',
  FEATURE_3_DESC: 'Download statements and track payments across the entire group.',
} as const

export default function OwnerBillingPage(): React.ReactElement {
  return (
    <ComingSoonPage
      icon={CreditCard}
      title={PO_BILLING_COPY.COMING_SOON_TITLE}
      description={PO_BILLING_COPY.COMING_SOON_DESC}
      features={[
        { title: PO_BILLING_COPY.FEATURE_1_TITLE, description: PO_BILLING_COPY.FEATURE_1_DESC },
        { title: PO_BILLING_COPY.FEATURE_2_TITLE, description: PO_BILLING_COPY.FEATURE_2_DESC },
        { title: PO_BILLING_COPY.FEATURE_3_TITLE, description: PO_BILLING_COPY.FEATURE_3_DESC },
      ]}
    />
  )
}

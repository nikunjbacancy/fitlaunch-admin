import React from 'react'
import { CreditCard } from 'lucide-react'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'

const PM_BILLING_COPY = {
  COMING_SOON_TITLE: 'Billing coming soon',
  COMING_SOON_DESC:
    'View your current plan, unit allocation, and invoice history without leaving the admin portal.',
  FEATURE_1_TITLE: 'Plan details',
  FEATURE_1_DESC: 'See your active subscription tier and included unit allocation at a glance.',
  FEATURE_2_TITLE: 'Invoice history',
  FEATURE_2_DESC: 'Download past invoices and track payment status across billing periods.',
  FEATURE_3_TITLE: 'Payment method',
  FEATURE_3_DESC: 'Update your card on file securely through our Stripe integration.',
} as const

export default function PmBillingPage(): React.ReactElement {
  return (
    <ComingSoonPage
      icon={CreditCard}
      title={PM_BILLING_COPY.COMING_SOON_TITLE}
      description={PM_BILLING_COPY.COMING_SOON_DESC}
      features={[
        { title: PM_BILLING_COPY.FEATURE_1_TITLE, description: PM_BILLING_COPY.FEATURE_1_DESC },
        { title: PM_BILLING_COPY.FEATURE_2_TITLE, description: PM_BILLING_COPY.FEATURE_2_DESC },
        { title: PM_BILLING_COPY.FEATURE_3_TITLE, description: PM_BILLING_COPY.FEATURE_3_DESC },
      ]}
    />
  )
}

import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BillingOverview } from '@/features/super-admin/billing/BillingOverview'
import { InvoiceTable } from '@/features/super-admin/billing/InvoiceTable'
import { SubscriptionTable } from '@/features/super-admin/billing/SubscriptionTable'
import { PricingTierForm } from '@/features/super-admin/billing/pricing-tiers/PricingTierForm'

export default function BillingPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Platform revenue, subscriptions, invoices, and pricing configuration."
      />

      <BillingOverview />

      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Tiers</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="mt-4">
          <SubscriptionTable />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <InvoiceTable />
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
          <PricingTierForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

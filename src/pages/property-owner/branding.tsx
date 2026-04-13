import React from 'react'
import { Palette } from 'lucide-react'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'

const PO_BRANDING_COPY = {
  COMING_SOON_TITLE: 'Portfolio branding coming soon',
  COMING_SOON_DESC:
    'Define the default look and feel for every property in your portfolio — logos, palettes, and app copy in one place.',
  FEATURE_1_TITLE: 'Portfolio-wide theme',
  FEATURE_1_DESC: 'Set the colors and logos that cascade down to every location you own.',
  FEATURE_2_TITLE: 'Per-location overrides',
  FEATURE_2_DESC: 'Let managers tailor their community while staying within your brand system.',
  FEATURE_3_TITLE: 'Brand asset library',
  FEATURE_3_DESC: 'Store approved logos and artwork that all properties can reuse instantly.',
} as const

export default function OwnerBrandingPage(): React.ReactElement {
  return (
    <ComingSoonPage
      icon={Palette}
      title={PO_BRANDING_COPY.COMING_SOON_TITLE}
      description={PO_BRANDING_COPY.COMING_SOON_DESC}
      features={[
        { title: PO_BRANDING_COPY.FEATURE_1_TITLE, description: PO_BRANDING_COPY.FEATURE_1_DESC },
        { title: PO_BRANDING_COPY.FEATURE_2_TITLE, description: PO_BRANDING_COPY.FEATURE_2_DESC },
        { title: PO_BRANDING_COPY.FEATURE_3_TITLE, description: PO_BRANDING_COPY.FEATURE_3_DESC },
      ]}
    />
  )
}

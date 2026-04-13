import React from 'react'
import { Dumbbell } from 'lucide-react'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'

const EQUIPMENT_COPY = {
  COMING_SOON_TITLE: 'Equipment coming soon',
  COMING_SOON_DESC:
    'Publish the gear available in your community gym so residents can plan workouts around what you actually have.',
  FEATURE_1_TITLE: 'Equipment catalog',
  FEATURE_1_DESC: 'Curate the list of machines, free weights, and accessories at your property.',
  FEATURE_2_TITLE: 'Availability status',
  FEATURE_2_DESC: 'Flag equipment as out-of-service so residents know what\u2019s usable.',
  FEATURE_3_TITLE: 'Workout matching',
  FEATURE_3_DESC: 'Help residents find workouts tailored to the equipment you offer.',
} as const

export default function EquipmentPage(): React.ReactElement {
  return (
    <ComingSoonPage
      icon={Dumbbell}
      title={EQUIPMENT_COPY.COMING_SOON_TITLE}
      description={EQUIPMENT_COPY.COMING_SOON_DESC}
      features={[
        { title: EQUIPMENT_COPY.FEATURE_1_TITLE, description: EQUIPMENT_COPY.FEATURE_1_DESC },
        { title: EQUIPMENT_COPY.FEATURE_2_TITLE, description: EQUIPMENT_COPY.FEATURE_2_DESC },
        { title: EQUIPMENT_COPY.FEATURE_3_TITLE, description: EQUIPMENT_COPY.FEATURE_3_DESC },
      ]}
    />
  )
}

import React from 'react'
import { Megaphone } from 'lucide-react'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'

const ANNOUNCEMENTS_COPY = {
  COMING_SOON_TITLE: 'Announcements coming soon',
  COMING_SOON_DESC:
    'Broadcast important updates — maintenance windows, events, and reminders — straight to your residents\u2019 phones.',
  FEATURE_1_TITLE: 'Push notifications',
  FEATURE_1_DESC: 'Send targeted messages that land on every resident\u2019s device in seconds.',
  FEATURE_2_TITLE: 'Scheduled broadcasts',
  FEATURE_2_DESC: 'Queue up recurring notices for events, drills, and amenity updates.',
  FEATURE_3_TITLE: 'Read receipts',
  FEATURE_3_DESC: 'See who saw your announcements and who still needs a nudge.',
} as const

export default function AnnouncementsPage(): React.ReactElement {
  return (
    <ComingSoonPage
      icon={Megaphone}
      title={ANNOUNCEMENTS_COPY.COMING_SOON_TITLE}
      description={ANNOUNCEMENTS_COPY.COMING_SOON_DESC}
      features={[
        {
          title: ANNOUNCEMENTS_COPY.FEATURE_1_TITLE,
          description: ANNOUNCEMENTS_COPY.FEATURE_1_DESC,
        },
        {
          title: ANNOUNCEMENTS_COPY.FEATURE_2_TITLE,
          description: ANNOUNCEMENTS_COPY.FEATURE_2_DESC,
        },
        {
          title: ANNOUNCEMENTS_COPY.FEATURE_3_TITLE,
          description: ANNOUNCEMENTS_COPY.FEATURE_3_DESC,
        },
      ]}
    />
  )
}

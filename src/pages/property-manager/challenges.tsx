import React from 'react'
import { Trophy } from 'lucide-react'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'

const CHALLENGES_COPY = {
  COMING_SOON_TITLE: 'Challenges coming soon',
  COMING_SOON_DESC:
    'Build engagement with weekly steps, workout streaks, and seasonal goals. Resident leaderboards will live here.',
  FEATURE_1_TITLE: 'Custom challenges',
  FEATURE_1_DESC: 'Pick a metric, set a target, and launch a campaign in minutes.',
  FEATURE_2_TITLE: 'Live leaderboards',
  FEATURE_2_DESC: 'Track participation and progress in real time across your community.',
  FEATURE_3_TITLE: 'Auto-rewards',
  FEATURE_3_DESC: 'Recognize top participants with branded shout-outs and badges.',
} as const

export default function ChallengesPage(): React.ReactElement {
  return (
    <ComingSoonPage
      icon={Trophy}
      title={CHALLENGES_COPY.COMING_SOON_TITLE}
      description={CHALLENGES_COPY.COMING_SOON_DESC}
      features={[
        { title: CHALLENGES_COPY.FEATURE_1_TITLE, description: CHALLENGES_COPY.FEATURE_1_DESC },
        { title: CHALLENGES_COPY.FEATURE_2_TITLE, description: CHALLENGES_COPY.FEATURE_2_DESC },
        { title: CHALLENGES_COPY.FEATURE_3_TITLE, description: CHALLENGES_COPY.FEATURE_3_DESC },
      ]}
    />
  )
}

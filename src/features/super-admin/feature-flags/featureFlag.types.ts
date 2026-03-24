export type FlagCategory = 'billing' | 'ui' | 'feature' | 'experiment'

export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  isEnabled: boolean
  category: FlagCategory
  affectsBilling: boolean
  updatedAt: string
}

import { z } from 'zod'

export type TierName = 'starter' | 'growth' | 'pro'

export interface PricingTier {
  id: string
  name: TierName
  monthlyPrice: number
  annualPrice: number
  maxMembers: number | null
  features: string[]
}

export interface PlatformPricing {
  tiers: PricingTier[]
  perUnitApartmentRate: number
}

export const pricingTierFormSchema = z.object({
  starter: z.object({
    monthlyPrice: z.number().positive('Must be a positive number'),
    annualPrice: z.number().positive('Must be a positive number'),
    maxMembers: z.number().int().positive(),
  }),
  growth: z.object({
    monthlyPrice: z.number().positive('Must be a positive number'),
    annualPrice: z.number().positive('Must be a positive number'),
    maxMembers: z.number().int().positive(),
  }),
  pro: z.object({
    monthlyPrice: z.number().positive('Must be a positive number'),
    annualPrice: z.number().positive('Must be a positive number'),
    maxMembers: z.null(),
  }),
  perUnitApartmentRate: z.number().positive('Must be a positive number'),
})

export type PricingTierFormValues = z.infer<typeof pricingTierFormSchema>

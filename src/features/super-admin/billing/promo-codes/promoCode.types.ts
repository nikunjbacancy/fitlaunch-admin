import { z } from 'zod'
import {
  MAX_DISCOUNT_PERCENT,
  MIN_DISCOUNT_PERCENT,
  MIN_CODE_LENGTH,
  MAX_CODE_LENGTH,
} from './promoCode.constants'

export type DiscountType = 'percent' | 'fixed'

export interface PromoCode {
  id: string
  code: string
  discountType: DiscountType
  discountValue: number
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

export const createPromoCodeSchema = z
  .object({
    code: z
      .string()
      .min(MIN_CODE_LENGTH, `Code must be at least ${String(MIN_CODE_LENGTH)} characters`)
      .max(MAX_CODE_LENGTH, `Code must be at most ${String(MAX_CODE_LENGTH)} characters`)
      .regex(/^[A-Z0-9_-]+$/, 'Only uppercase letters, numbers, hyphens, and underscores'),
    discountType: z.enum(['percent', 'fixed']),
    discountValue: z.number().min(MIN_DISCOUNT_PERCENT, 'Must be at least 1'),
    maxUses: z.number().int().positive().nullable(),
    expiresAt: z.string().nullable(),
  })
  .refine((data) => data.discountType !== 'percent' || data.discountValue <= MAX_DISCOUNT_PERCENT, {
    message: `Percentage discount cannot exceed ${String(MAX_DISCOUNT_PERCENT)}%`,
    path: ['discountValue'],
  })

export type CreatePromoCodeValues = z.infer<typeof createPromoCodeSchema>

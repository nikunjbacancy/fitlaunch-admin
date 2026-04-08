import { z } from 'zod'

export type PmAssignmentType = 'existing' | 'new' | 'skip'

export const createLocationSchema = z
  .object({
    complex_name: z.string().min(3, 'Complex name must be at least 3 characters'),
    unit_count: z
      .number({ invalid_type_error: 'Unit count must be a number' })
      .int('Unit count must be a whole number')
      .min(1, 'Must have at least 1 unit')
      .max(10000, 'Cannot exceed 10,000 units'),
    price_per_unit: z
      .number({ invalid_type_error: 'Price must be a number' })
      .min(2, 'Minimum price is $2.00')
      .max(5, 'Maximum price is $5.00'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    pm_assignment: z.enum(['existing', 'new', 'skip']).default('skip'),
    existing_manager_id: z.string().optional(),
    new_manager_name: z.string().optional(),
    new_manager_email: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.pm_assignment === 'existing') return Boolean(data.existing_manager_id)
      return true
    },
    { message: 'Please select a manager', path: ['existing_manager_id'] }
  )
  .refine(
    (data) => {
      if (data.pm_assignment === 'new') {
        return Boolean(data.new_manager_name) && data.new_manager_name.length >= 2
      }
      return true
    },
    { message: 'Name must be at least 2 characters', path: ['new_manager_name'] }
  )
  .refine(
    (data) => {
      if (data.pm_assignment === 'new') {
        return (
          Boolean(data.new_manager_email) &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.new_manager_email)
        )
      }
      return true
    },
    { message: 'Valid email is required', path: ['new_manager_email'] }
  )

export type TCreateLocationPayload = z.infer<typeof createLocationSchema>

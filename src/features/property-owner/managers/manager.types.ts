import { z } from 'zod'

export interface LocationManager {
  id: string
  fullName: string
  email: string
  status: string
  locationId: string
  locationName: string
}

export const addManagerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  location_id: z.string().min(1, 'Please select a location'),
})

export type TAddManagerPayload = z.infer<typeof addManagerSchema>

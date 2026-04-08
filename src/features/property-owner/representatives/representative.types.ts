import { z } from 'zod'

export const inviteRepresentativeSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
})

export type TInviteRepresentativePayload = z.infer<typeof inviteRepresentativeSchema>

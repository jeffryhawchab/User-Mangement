import { z } from 'zod'

export const UserStatus = z.enum(['active', 'locked'])

export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: UserStatus,
})

export type UserFormData = z.infer<typeof userSchema>
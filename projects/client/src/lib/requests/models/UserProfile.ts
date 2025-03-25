import { UserNameSchema } from '$lib/requests/models/UserName.ts';
import z from 'zod';

export const UserProfileSchema = z.object({
  username: z.string(),
  name: UserNameSchema,
  private: z.boolean(),
  isVip: z.boolean(),
  isDeleted: z.boolean(),
  slug: z.string().nullable(),
  avatar: z.object({
    url: z.string(),
  }),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

import z from 'zod';

export const UserProfileSchema = z.object({
  username: z.string(),
  name: z.string().nullable(),
  private: z.boolean(),
  isVip: z.boolean(),
  isDeleted: z.boolean(),
  slug: z.string().nullable(),
  avatar: z.object({
    url: z.string(),
  }),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

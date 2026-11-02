import { z } from 'zod';
import { ShareUserSchema } from './ShareUser.ts';

export const ProfileShareDataSchema = z.object({
  user: ShareUserSchema,
  joinedYear: z.number().nullish(),
  location: z.string().nullish(),
  coverUrl: z.string().nullish(),
});

export type ProfileShareData = z.infer<typeof ProfileShareDataSchema>;

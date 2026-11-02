import { z } from 'zod';
import { ShareUserSchema } from './ShareUser.ts';

export const ProfileShareDataSchema = z.object({
  user: ShareUserSchema,
  joinedYear: z.number().nullish(),
});

export type ProfileShareData = z.infer<typeof ProfileShareDataSchema>;

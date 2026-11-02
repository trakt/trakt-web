import { z } from 'zod';

export const ShareUserSchema = z.object({
  name: z.string(),
  username: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  isVip: z.boolean(),
  isDirector: z.boolean(),
});

export type ShareUser = z.infer<typeof ShareUserSchema>;

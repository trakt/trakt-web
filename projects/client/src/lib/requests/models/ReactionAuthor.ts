import { z } from 'zod';

export const ReactionAuthorSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullish(),
  isVip: z.boolean().default(false),
});

export type ReactionAuthor = z.infer<typeof ReactionAuthorSchema>;

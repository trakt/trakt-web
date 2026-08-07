import { z } from 'zod';
import { ReactionAuthorSchema } from './ReactionAuthor.ts';

export const ForumReplySchema = z.object({
  id: z.string(),
  author: ReactionAuthorSchema,
  body: z.string(),
  gifUrl: z.string().nullish(),
  createdAt: z.string(),
});

export type ForumReply = z.infer<typeof ForumReplySchema>;

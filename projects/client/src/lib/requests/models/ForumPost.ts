import { z } from 'zod';
import { ForumReplySchema } from './ForumReply.ts';
import { ReactionAuthorSchema } from './ReactionAuthor.ts';
import { ReactionSentimentSchema } from './ReactionSentiment.ts';

export const ForumPostSchema = z.object({
  id: z.string(),
  sentiment: ReactionSentimentSchema,
  author: ReactionAuthorSchema,
  body: z.string(),
  gifUrl: z.string().nullish(),
  createdAt: z.string(),
  likeCount: z.number(),
  replies: z.array(ForumReplySchema),
});

export type ForumPost = z.infer<typeof ForumPostSchema>;

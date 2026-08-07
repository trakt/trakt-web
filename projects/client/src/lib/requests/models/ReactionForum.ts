import { z } from 'zod';
import { ForumPostSchema } from './ForumPost.ts';
import { ReactionSentimentSchema } from './ReactionSentiment.ts';

// A single sentiment's public forum: the volatile, emotional sandbox that a
// reaction chip drills down into.
export const ReactionForumSchema = z.object({
  sentiment: ReactionSentimentSchema,
  posts: z.array(ForumPostSchema),
});

export type ReactionForum = z.infer<typeof ReactionForumSchema>;

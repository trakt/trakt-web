import { z } from 'zod';

// The reaction taxonomy intentionally extends far beyond a binary like/dislike:
// it captures visceral, emotional responses (including the deliberately
// stomach-churning "vomit") that are kept separate from rational reviews.
export const ReactionSentimentSchema = z.enum([
  'love',
  'thrilled',
  'mindblown',
  'moved',
  'shook',
  'bored',
  'cringe',
  'enraged',
  'vomit',
]);

export type ReactionSentiment = z.infer<typeof ReactionSentimentSchema>;

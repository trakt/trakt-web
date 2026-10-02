import { z } from 'zod';
import { MediaReactionSchema } from './MediaReaction.ts';

export const UserMediaReactionSchema = z.object({
  id: z.number(),
  reaction: MediaReactionSchema,
});

export type UserMediaReaction = z.infer<typeof UserMediaReactionSchema>;

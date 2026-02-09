import { z } from 'zod';

export const MediaTriviaSchema = z.object({
  key: z.string(),
  text: z.string(),
  isSpoiler: z.boolean().optional(),
});

export type MediaTrivia = z.infer<
  typeof MediaTriviaSchema
>;

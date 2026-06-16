import { z } from 'zod';

export const TriviaCategorySchema = z.enum([
  'bts',
  'cast_n_crew',
  'story_n_themes',
  'impact_n_legacy',
  'real_world_connections',
]);

export type TriviaCategory = z.infer<typeof TriviaCategorySchema>;

export const MediaTriviaSchema = z.object({
  key: z.string(),
  text: z.string(),
  isSpoiler: z.boolean().optional(),
  category: TriviaCategorySchema,
});

export type MediaTrivia = z.infer<typeof MediaTriviaSchema>;

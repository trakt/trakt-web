import { z } from 'zod';

export const TriviaResponseSchema = z.object({
  items: z.array(
    z.object({
      fact_id: z.string(),
      category: z.enum([
        'bts',
        'cast_n_crew',
        'story_n_themes',
        'impact_n_legacy',
        'real_world_connections',
      ]),
      text: z.string(),
      order: z.number(),
      spoiler: z.boolean(),
    }),
  ),
  summary: z.array(z.string()),
});

export type TriviaResponse = z.infer<
  typeof TriviaResponseSchema
>;

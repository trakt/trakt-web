import { z } from 'zod';

export const TriviaResponseSchema = z.object({
  id: z.string(),
  spoiler: z.boolean(),
  text: z.string(),
  votes: z.number(),
});

export type TriviaResponse = z.infer<
  typeof TriviaResponseSchema
>;

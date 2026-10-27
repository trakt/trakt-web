import { z } from 'zod';
import { RecapLineResponseSchema } from './RecapLineResponse.ts';

export const ShowRecapStoryResponseSchema = z.object({
  checkpoint: z.number(),
  segments: z.array(
    z.object({
      season: z.number(),
      text: z.string(),
    }),
  ),
  latest: z.object({
    whereThingsStand: z.array(RecapLineResponseSchema),
  }),
});

export type ShowRecapStoryResponse = z.infer<
  typeof ShowRecapStoryResponseSchema
>;

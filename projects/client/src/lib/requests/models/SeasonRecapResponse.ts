import { z } from 'zod';
import { RecapLineResponseSchema } from './RecapLineResponse.ts';

export const SeasonRecapResponseSchema = z.object({
  season: z.number(),
  recap: z.string(),
  keyPoints: z.array(z.string()),
  whereThingsStand: z.array(RecapLineResponseSchema),
  attribution: z.string().nullish(),
  expanded: z.string().nullish(),
  storySegment: z.string().nullish(),
});

export type SeasonRecapResponse = z.infer<typeof SeasonRecapResponseSchema>;

import { z } from 'zod';
import { RecapLineSchema } from './RecapLine.ts';

export const ShowRecapStorySchema = z.object({
  checkpoint: z.number(),
  segments: z.array(
    z.object({
      season: z.number(),
      text: z.string(),
    }),
  ),
  lines: z.array(RecapLineSchema),
});

export type ShowRecapStory = z.infer<typeof ShowRecapStorySchema>;

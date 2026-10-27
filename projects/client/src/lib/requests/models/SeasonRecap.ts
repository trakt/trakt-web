import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';
import { RecapLineSchema } from './RecapLine.ts';

export const SeasonRecapSchema = z.object({
  season: z.number(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  lines: z.array(RecapLineSchema),
  attribution: HttpsUrlSchema.nullable(),
  chapters: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      body: z.string(),
    }),
  ),
  hasStory: z.boolean(),
});

export type SeasonRecap = z.infer<typeof SeasonRecapSchema>;

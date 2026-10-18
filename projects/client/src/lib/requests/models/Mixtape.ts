import { z } from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

export const MixtapeSchema = z.object({
  fits: z.array(
    z.object({
      id: z.number(),
      score: z.number(),
      media: z.union([MovieEntrySchema, ShowEntrySchema]).optional(),
    }),
  ),
  suggestions: z.array(
    z.object({
      media: z.union([MovieEntrySchema, ShowEntrySchema]),
      because: z.number(),
      match: z.number(),
    }),
  ),
});

export type Mixtape = z.infer<typeof MixtapeSchema>;

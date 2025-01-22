import { z } from 'zod';

export const SeasonSchema = z.object({
  id: z.number(),
  number: z.number(),
  episodes: z.object({
    count: z.number(),
  }),
});
export type Season = z.infer<typeof SeasonSchema>;

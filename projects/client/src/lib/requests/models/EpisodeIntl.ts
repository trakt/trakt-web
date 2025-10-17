import { z } from 'zod';

export const EpisodeIntlSchema = z.object({
  title: z.string().nullish(),
  overview: z.string().nullish(),
  country: z.string().nullish(),
});

export type EpisodeIntl = z.infer<typeof EpisodeIntlSchema>;

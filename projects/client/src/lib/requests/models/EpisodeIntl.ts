import { z } from 'zod';

export const EpisodeIntlSchema = z.object({
  title: z.string().nullable(),
  overview: z.string().nullable(),
});

export type EpisodeIntl = z.infer<typeof EpisodeIntlSchema>;

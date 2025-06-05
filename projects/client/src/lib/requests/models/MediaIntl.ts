import { EpisodeIntlSchema } from '$lib/requests/models/EpisodeIntl.ts';
import { z } from 'zod';

export const MediaIntlSchema = EpisodeIntlSchema.extend({
  tagline: z.string().nullish(),
});
export type MediaIntl = z.infer<typeof MediaIntlSchema>;

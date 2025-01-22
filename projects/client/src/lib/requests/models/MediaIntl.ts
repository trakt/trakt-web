import { EpisodeIntlSchema } from '$lib/requests/models/EpisodeIntl';
import { z } from 'zod';

export const MediaIntlSchema = EpisodeIntlSchema.extend({
  tagline: z.string().nullable(),
});
export type MediaIntl = z.infer<typeof MediaIntlSchema>;

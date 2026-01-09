import { crewPositionSchema } from '@trakt/api';
import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';

export const PersonSummarySchema = z.object({
  id: z.number(),
  key: z.string(),
  name: z.string(),
  biography: z.string(),
  headshot: z.object({
    url: ImageUrlsSchema,
  }),
  slug: z.string(),
  knownFor: crewPositionSchema.nullish(),
  height: z.number().nullish(),
  birthday: z.date().nullish(),
  deathDate: z.date().nullish(),
  imdb: z.string().nullish(),
  socialMedia: z.object({
    x: z.string().nullish(),
    instagram: z.string().nullish(),
    facebook: z.string().nullish(),
  }).optional(),
});

export type PersonSummary = z.infer<typeof PersonSummarySchema>;

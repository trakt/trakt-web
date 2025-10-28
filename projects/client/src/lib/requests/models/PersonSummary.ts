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
  birthday: z.date().nullish(),
});

export type PersonSummary = z.infer<typeof PersonSummarySchema>;

import { z } from 'zod';
import { crewPositionSchema } from './CrewPosition.ts';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';
import { personSocialMediaSchema } from './PersonSocialMedia.ts';

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
  socialMedia: personSocialMediaSchema.optional(),
});

export type PersonSummary = z.infer<typeof PersonSummarySchema>;

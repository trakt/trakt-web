import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';

const YirPersonTitleSchema = z.object({
  title: z.string(),
  type: z.enum(['show', 'movie']),
  traktId: z.number(),
  episodeCount: z.number().optional(),
});

export const YirPersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  headshot: z.object({
    url: ImageUrlsSchema,
  }),
  count: z.object({
    movies: z.number(),
    shows: z.number(),
  }),
  titles: YirPersonTitleSchema.array(),
});

export type YirPerson = z.infer<typeof YirPersonSchema>;
export type YirPersonTitle = z.infer<typeof YirPersonTitleSchema>;

export type YirPeopleType =
  | 'actors'
  | 'actresses'
  | 'directors'
  | 'writers';

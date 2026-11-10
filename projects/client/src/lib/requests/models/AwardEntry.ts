import { z } from 'zod';
import { AwardCeremonyKeySchema } from './AwardCeremonyKey.ts';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';
import { MediaTypeSchema } from './MediaType.ts';

const AwardCeremonySchema = z.object({
  key: AwardCeremonyKeySchema,
  slug: z.string(),
  name: z.string(),
  edition: z.number().nullish(),
  nominationsAt: z.date().nullish(),
  heldAt: z.date().nullish(),
});

const AwardPersonSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  headshot: z.object({ url: ImageUrlsSchema }),
});

const AwardMediaSchema = z.object({
  type: MediaTypeSchema,
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  year: z.number().nullish(),
  poster: z.object({ url: ImageUrlsSchema }),
});

export const AwardEntrySchema = z.object({
  key: z.string(),
  category: z.string(),
  ceremony: AwardCeremonySchema,
  year: z.number(),
  won: z.boolean().nullable(),
  person: AwardPersonSchema.optional(),
  media: AwardMediaSchema.optional(),
});
export type AwardEntry = z.infer<typeof AwardEntrySchema>;

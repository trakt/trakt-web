import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { z } from 'zod';

const BaseCreditSchema = z.object({
  media: MediaEntrySchema,
  key: z.string(),
});

const CharacterSchema = BaseCreditSchema.extend({
  character: z.string(),
  type: z.literal('cast'),
});

const CrewSchema = BaseCreditSchema.extend({
  job: z.string(),
  type: z.literal('crew'),
});

const MediaCreditSchema = z.discriminatedUnion('type', [
  CharacterSchema,
  CrewSchema,
]);

export const MediaCreditsSchema = z
  .map(
    z.string(),
    MediaCreditSchema.array(),
  );

export type MediaCredit = z.infer<typeof MediaCreditSchema>;
export type MediaCredits = z.infer<typeof MediaCreditsSchema>;

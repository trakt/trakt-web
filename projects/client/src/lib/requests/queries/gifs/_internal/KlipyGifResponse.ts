import { z } from 'zod';

const KlipySourceSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

// Klipy ships four sizes (hd/md/sm/xs) in five formats each. Only the two we
// render are declared - zod drops the rest so the payload stays small.
const KlipyFormatsSchema = z.object({
  gif: KlipySourceSchema,
  webp: KlipySourceSchema.optional(),
  jpg: KlipySourceSchema.optional(),
});

export const KlipyGifResponseSchema = z.object({
  id: z.union([z.number(), z.string()]),
  slug: z.string(),
  title: z.string(),
  // Klipy mixes sponsored items into the same feed; only `gif` is a real gif.
  type: z.literal('gif'),
  blur_preview: z.string().nullish(),
  file: z.object({
    md: KlipyFormatsSchema,
    sm: KlipyFormatsSchema,
  }),
});

export type KlipyGifResponse = z.infer<typeof KlipyGifResponseSchema>;

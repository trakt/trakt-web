import { z } from 'zod';

const GifSourceSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const GifEntrySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  preview: GifSourceSchema,
  full: GifSourceSchema,
  still: GifSourceSchema.nullish(),
  blurPreview: z.string().nullish(),
});

export type GifEntry = z.infer<typeof GifEntrySchema>;

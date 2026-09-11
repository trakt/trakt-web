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
  // Light animated variant, only ever rendered inside the picker grid.
  preview: GifSourceSchema,
  // The link that goes into the comment. Every Trakt client renders whatever
  // is stored here, so it stays a plain animated gif.
  url: z.string(),
  // Frozen frame, shown instead of the preview under reduced motion.
  still: GifSourceSchema.nullish(),
  // Inline base64 placeholder, shown while the preview downloads.
  blurPreview: z.string().nullish(),
});

export type GifEntry = z.infer<typeof GifEntrySchema>;

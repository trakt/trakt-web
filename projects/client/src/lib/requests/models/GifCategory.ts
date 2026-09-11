import { z } from 'zod';

export const GifCategorySchema = z.object({
  title: z.string(),
  query: z.string(),
  previewUrl: z.string(),
});

export type GifCategory = z.infer<typeof GifCategorySchema>;

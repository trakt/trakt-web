import { z } from 'zod';

export const BulkIntlSchema = z.object({
  movie: z.map(z.number(), z.string()),
  show: z.map(z.number(), z.string()),
  episode: z.map(z.number(), z.string()),
});

export type BulkIntl = z.infer<typeof BulkIntlSchema>;

const TitleSchema = z.object({ title: z.string().nullish() });

export const BulkIntlResponseSchema = z.object({
  movie: z.record(z.string(), TitleSchema).default({}),
  show: z.record(z.string(), TitleSchema).default({}),
  episode: z.record(z.string(), TitleSchema).default({}),
});

export type BulkIntlResponse = z.infer<typeof BulkIntlResponseSchema>;

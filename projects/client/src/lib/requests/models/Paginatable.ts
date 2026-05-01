import { z } from 'zod';

export const PaginatedPageMetaSchema = z.object({
  type: z.literal('paginated'),
  current: z.number(),
  total: z.number(),
});

export const InfinitePageMetaSchema = z.object({
  type: z.literal('infinite'),
  current: z.number(),
});

export const PageMetaSchema = z.discriminatedUnion('type', [
  PaginatedPageMetaSchema,
  InfinitePageMetaSchema,
]);

export const PaginatableSchemaFactory = <T extends z.ZodType>(entrySchema: T) =>
  z.object({
    entries: z.array(entrySchema),
    page: PageMetaSchema,
  });

export type PaginatedPageMeta = z.infer<typeof PaginatedPageMetaSchema>;
export type InfinitePageMeta = z.infer<typeof InfinitePageMetaSchema>;
export type PageMeta = z.infer<typeof PageMetaSchema>;
export type Paginatable<T> = z.infer<
  ReturnType<typeof PaginatableSchemaFactory<z.ZodType<T>>>
>;

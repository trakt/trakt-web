import { z } from 'zod';

export const PageMetaSchema = z.object({
  current: z.number(),
  total: z.number(),
});

export const PaginatableSchemaFactory = <T extends z.ZodType>(entrySchema: T) =>
  z.object({
    entries: z.array(entrySchema),
    page: PageMetaSchema,
  });

export type PageMeta = z.infer<typeof PageMetaSchema>;
export type Paginatable<T> = z.infer<
  ReturnType<typeof PaginatableSchemaFactory<z.ZodType<T>>>
>;

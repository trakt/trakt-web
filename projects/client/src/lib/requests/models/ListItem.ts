import { z } from 'zod';
import { MediaTypeSchema } from './MediaType.ts';

export const ListItemSchemaFactory = <T extends z.ZodType>(entrySchema: T) =>
  z.object({
    id: z.number(),
    rank: z.number(),
    notes: z.string().nullable(),
    listedAt: z.date(),
    type: MediaTypeSchema,
    entry: entrySchema,
  });

export type ListItem<TMediaEntry> = z.infer<
  ReturnType<typeof ListItemSchemaFactory<z.ZodType<TMediaEntry>>>
>;

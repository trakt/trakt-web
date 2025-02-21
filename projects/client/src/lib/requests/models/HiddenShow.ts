import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import z from 'zod';

export const HiddenShowSchema = z.object({
  hiddenAt: z.date(),
  show: ShowEntrySchema,
});
export type HiddenShow = z.infer<typeof HiddenShowSchema>;

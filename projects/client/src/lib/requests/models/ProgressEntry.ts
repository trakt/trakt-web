import { ShowProgressSchema } from '$lib/requests/models/ShowProgress.ts';
import { z } from 'zod';
import { ShowEntrySchema } from './ShowEntry.ts';

const BaseProgressEntrySchema = z.object({
  key: z.string(),
  show: ShowEntrySchema,
});

export const WatchedProgressEntrySchema = BaseProgressEntrySchema
  .merge(z.object({ type: z.literal('watched') }))
  .merge(ShowProgressSchema);

export const DroppedProgressEntrySchema = BaseProgressEntrySchema.merge(
  z.object({
    type: z.literal('dropped'),
    hiddenAt: z.date(),
  }),
);

export const ProgressEntrySchema = z.discriminatedUnion('type', [
  WatchedProgressEntrySchema,
  DroppedProgressEntrySchema,
]);

export type WatchedProgressEntry = z.infer<typeof WatchedProgressEntrySchema>;
export type DroppedProgressEntry = z.infer<typeof DroppedProgressEntrySchema>;
export type ProgressEntry = z.infer<typeof ProgressEntrySchema>;

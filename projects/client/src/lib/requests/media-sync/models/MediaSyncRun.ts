import z from 'zod';

export const MediaSyncRunSchema = z.object({
  id: z.number(),
  libraryId: z.number().nullable(),
  kind: z.enum(['full', 'incremental', 'invalidate', 'webhook']),
  feed: z.string(),
  status: z.enum(['planned', 'running', 'completed', 'failed', 'aborted']),
  itemsSeen: z.number(),
  itemsWritten: z.number(),
  itemsRemoved: z.number(),
  error: z.string().nullable(),
  createdAt: z.date(),
  finishedAt: z.date().nullable(),
});

export type MediaSyncRun = z.infer<typeof MediaSyncRunSchema>;

import { z } from 'zod';
import { SmartListDraftSummarySchema } from './SmartListDraftSummary.ts';

export const SmartListDraftsSummarySchema = z.object({
  convertibleCount: z.number(),
  bestConfidence: z.number().nullable(),
  lists: z.array(SmartListDraftSummarySchema),
});

export type SmartListDraftsSummary = z.infer<
  typeof SmartListDraftsSummarySchema
>;

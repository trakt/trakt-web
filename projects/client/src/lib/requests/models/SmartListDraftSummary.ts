import { z } from 'zod';

export const SmartListDraftSummarySchema = z.object({
  slug: z.string(),
  name: z.string().nullable(),
  count: z.number().nullable(),
  confidence: z.number(),
});

export type SmartListDraftSummary = z.infer<typeof SmartListDraftSummarySchema>;

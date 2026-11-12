import { z } from 'zod';
import { DocumentaryDisputeSchema } from './DocumentaryDispute.ts';
import { DocumentaryTierSchema } from './DocumentaryTier.ts';

export const DocumentaryCheckSchema = z.object({
  kind: z.literal('documentary'),
  tier: DocumentaryTierSchema,
  summary: z.string(),
  makers: z.object({
    madeBy: z.array(z.string()),
    fundedBy: z.array(z.string()),
  }),
  disputes: z.array(DocumentaryDisputeSchema),
});

export type DocumentaryCheck = z.infer<typeof DocumentaryCheckSchema>;

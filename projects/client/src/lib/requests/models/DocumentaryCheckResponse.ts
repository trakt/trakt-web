import { z } from 'zod';
import { DocumentaryDisputeSchema } from './DocumentaryCheck.ts';
import { DocumentaryTierSchema } from './DocumentaryTier.ts';

const ApplicableDocumentaryCheckResponseSchema = z.object({
  applicable: z.literal(true),
  tier: DocumentaryTierSchema,
  summary: z.string(),
  makers: z.object({
    madeBy: z.array(z.string()),
    fundedBy: z.array(z.string()),
  }),
  disputes: z.array(DocumentaryDisputeSchema).optional(),
});

export const DocumentaryCheckResponseSchema = z.discriminatedUnion(
  'applicable',
  [
    ApplicableDocumentaryCheckResponseSchema,
    z.object({ applicable: z.literal(false) }),
  ],
);

export type DocumentaryCheckResponse = z.infer<
  typeof DocumentaryCheckResponseSchema
>;

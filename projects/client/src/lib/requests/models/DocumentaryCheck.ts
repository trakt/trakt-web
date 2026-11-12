import { z } from 'zod';
import { DocumentaryTierSchema } from './DocumentaryTier.ts';

export const DocumentaryDisputeTypeSchema = z.enum([
  'expert',
  'press',
  'interested',
  'filmmaker',
]);

export const DocumentaryDisputeSchema = z.object({
  claim: z.string(),
  by: z.string(),
  type: DocumentaryDisputeTypeSchema,
  year: z.number().nullable(),
  reply: z.string().nullable(),
  impact: z.enum(['major', 'minor']),
});

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
export type DocumentaryDispute = z.infer<typeof DocumentaryDisputeSchema>;

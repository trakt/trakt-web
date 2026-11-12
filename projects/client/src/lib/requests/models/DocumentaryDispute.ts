import { z } from 'zod';

export const DocumentaryDisputeSchema = z.object({
  claim: z.string(),
  by: z.string(),
  type: z.enum(['expert', 'press', 'interested', 'filmmaker']),
  year: z.number().nullable(),
  reply: z.string().nullable(),
  impact: z.enum(['major', 'minor']),
});

export type DocumentaryDispute = z.infer<typeof DocumentaryDisputeSchema>;

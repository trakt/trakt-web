import { crewPositionSchema } from '@trakt/api';
import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const PersonSummarySchema = z.object({
  name: z.string(),
  biography: z.string(),
  headShotUrl: HttpsUrlSchema,
  slug: z.string(),
  knownFor: crewPositionSchema.optional(),
});

export type PersonSummary = z.infer<typeof PersonSummarySchema>;

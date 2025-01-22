import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema';

export const PersonSummarySchema = z.object({
  name: z.string(),
  biography: z.string(),
  headShotUrl: HttpsUrlSchema,
  slug: z.string(),
});
export type PersonSummary = z.infer<typeof PersonSummarySchema>;

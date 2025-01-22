import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema';

export const WatchNowSourceSchema = z.object({
  source: z.string(),
  name: z.string(),
  isFree: z.boolean(),
  logoUrl: HttpsUrlSchema.nullish(),
});

export type WatchNowSource = z.infer<typeof WatchNowSourceSchema>;

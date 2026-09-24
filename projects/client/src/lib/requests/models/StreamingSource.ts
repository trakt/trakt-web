import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';
import { StreamingSourceTypeSchema } from './StreamingSourceType.ts';

export const StreamingSourceSchema = z.object({
  source: z.string(),
  name: z.string(),
  type: StreamingSourceTypeSchema.nullish(),
  isFree: z.boolean(),
  logoUrl: HttpsUrlSchema.nullish(),
  channelLogoUrl: HttpsUrlSchema.nullish(),
  color: z.string().nullish(),
});

export type StreamingSource = z.infer<
  typeof StreamingSourceSchema
>;

import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const StreamNowSchema = z.object({
  link: HttpsUrlSchema,
  source: z.string(),
  is4k: z.boolean(),
  type: z.literal('streaming'),
});
export type StreamNow = z.infer<
  typeof StreamNowSchema
>;

export const StreamOnDemandSchema = z.object({
  link: HttpsUrlSchema,
  source: z.string(),
  is4k: z.boolean(),
  type: z.literal('on-demand'),
  currency: z.string(),
  prices: z.object({
    rent: z.number().optional(),
    purchase: z.number().optional(),
  }),
});
export type StreamOnDemand = z.infer<typeof StreamOnDemandSchema>;

export const StreamingServiceOptionsSchema = z.object({
  streaming: StreamNowSchema.array(),
  onDemand: StreamOnDemandSchema.array(),
});

export type StreamingServiceOption = StreamNow | StreamOnDemand;
export type StreamingServiceOptions = z.infer<
  typeof StreamingServiceOptionsSchema
>;

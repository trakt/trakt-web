import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const StreamingSubscriptionSchema = z.object({
  link: HttpsUrlSchema,
  source: z.string(),
  is4k: z.boolean(),
  type: z.literal('streaming'),
});
export type StreamNow = z.infer<
  typeof StreamingSubscriptionSchema
>;

export const OnDemandStreamingSchema = z.object({
  link: HttpsUrlSchema,
  deepLink: z.string().nullish(),
  source: z.string(),
  is4k: z.boolean(),
  type: z.literal('on-demand'),
  currency: z.string().nullish(),
  prices: z.object({
    rent: z.number().optional(),
    purchase: z.number().optional(),
  }),
});
export type StreamOnDemand = z.infer<typeof OnDemandStreamingSchema>;

export const StreamingServiceOptionsSchema = z.object({
  streaming: StreamingSubscriptionSchema.array(),
  onDemand: OnDemandStreamingSchema.array(),
});

export type StreamingServiceOption = StreamNow | StreamOnDemand;
export type StreamingServiceOptions = z.infer<
  typeof StreamingServiceOptionsSchema
>;

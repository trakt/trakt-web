import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

const StreamingRankSchema = z.object({
  current: z.number(),
  delta: z.number(),
});

export type StreamingRank = z.infer<typeof StreamingRankSchema>;

export const StreamingSubscriptionSchema = z.object({
  link: HttpsUrlSchema,
  source: z.string(),
  is4k: z.boolean(),
  type: z.literal('streaming'),
  key: z.string(),
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
  key: z.string(),
});
export type StreamOnDemand = z.infer<typeof OnDemandStreamingSchema>;

export const StreamingServiceOptionsSchema = z.object({
  streaming: StreamingSubscriptionSchema.array(),
  onDemand: OnDemandStreamingSchema.array(),
  streamingRank: StreamingRankSchema.optional(),
});

export type StreamingServiceOption = StreamNow | StreamOnDemand;
export type StreamingServiceOptions = z.infer<
  typeof StreamingServiceOptionsSchema
>;

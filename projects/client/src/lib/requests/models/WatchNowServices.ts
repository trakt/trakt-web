import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema';

export const WatchNowStreamingSchema = z.object({
  link: HttpsUrlSchema,
  source: z.string(),
  is4k: z.boolean(),
  type: z.literal('streaming'),
});
export type WatchNowStreaming = z.infer<
  typeof WatchNowStreamingSchema
>;

export const WatchNowOnDemandSchema = z.object({
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
export type WatchNowOnDemand = z.infer<typeof WatchNowOnDemandSchema>;

export const WatchNowServicesSchema = z.object({
  streaming: WatchNowStreamingSchema.array(),
  onDemand: WatchNowOnDemandSchema.array(),
});
export type WatchNowServices = z.infer<typeof WatchNowServicesSchema>;

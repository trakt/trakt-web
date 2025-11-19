import z from 'zod';
import {
  OnDemandStreamingSchema,
  StreamingSubscriptionSchema,
} from './StreamingServiceOptions.ts';

export const CountryStreamingServiceOptionsSchema = z.object({
  country: z.string(),
  services: z.array(StreamingSubscriptionSchema.or(OnDemandStreamingSchema)),
});

export type CountryStreamingServiceOptions = z.infer<
  typeof CountryStreamingServiceOptionsSchema
>;

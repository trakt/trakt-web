import z from 'zod';
import {
  FreeStreamingSchema,
  OnDemandStreamingSchema,
  StreamingSubscriptionSchema,
} from './StreamingServiceOptions.ts';

export const CountryStreamingServiceOptionsSchema = z.object({
  country: z.string(),
  services: z.array(
    StreamingSubscriptionSchema.or(OnDemandStreamingSchema).or(
      FreeStreamingSchema,
    ),
  ),
});

export type CountryStreamingServiceOptions = z.infer<
  typeof CountryStreamingServiceOptionsSchema
>;

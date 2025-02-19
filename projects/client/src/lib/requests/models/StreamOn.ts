import {
  StreamingServiceOptionsSchema,
  StreamingSubscriptionSchema,
} from '$lib/requests/models/StreamingServiceOptions.ts';
import { z } from 'zod';

export const StreamOnSchema = z.object({
  services: StreamingServiceOptionsSchema.optional(),
  preferred: StreamingSubscriptionSchema.optional(),
});

export type StreamOn = z.infer<typeof StreamOnSchema>;

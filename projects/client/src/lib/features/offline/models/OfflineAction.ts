import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import { invalidationId } from '$lib/requests/models/InvalidateAction.ts';
import { z } from 'zod';
import { OfflineActionEndpointSchema } from './OfflineActionEndpoint.ts';

const InvalidateActionSchema = z.custom<InvalidateActionOptions>(
  (value) => typeof value === 'string' && value.startsWith(invalidationId()),
);

export const OfflineActionSchema = z.object({
  id: z.string(),
  endpoint: OfflineActionEndpointSchema,
  keys: z.array(z.string()),
  body: z.unknown(),
  invalidations: z.array(InvalidateActionSchema),
  queuedAt: z.number(),
});

export type OfflineAction = z.infer<typeof OfflineActionSchema>;

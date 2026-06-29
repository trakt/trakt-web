import { z } from 'zod';

export const ConnectedAppResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  approved: z.boolean(),
  scopes: z.array(z.string()),
  connected_at: z.string(),
  last_used_at: z.string(),
});

export type ConnectedAppResponse = z.infer<typeof ConnectedAppResponseSchema>;

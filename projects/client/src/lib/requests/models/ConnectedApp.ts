import { z } from 'zod';

export const ConnectedAppSchema = z.object({
  id: z.number(),
  key: z.string(),
  name: z.string(),
  isApproved: z.boolean(),
  scopes: z.array(z.string()),
  connectedAt: z.date(),
  lastUsedAt: z.date(),
});

export type ConnectedApp = z.infer<typeof ConnectedAppSchema>;

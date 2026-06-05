import { z } from 'zod';

export const StreamingConnectionSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  isVip: z.boolean(),
  color: z.string().nullish(),
  logoUrl: z.string().nullish(),
  isConnectable: z.boolean(),
  isConnected: z.boolean(),
  isActive: z.boolean(),
  profile: z.string().nullish(),
  lastSyncedAt: z.date().nullish(),
});

export type StreamingConnection = z.infer<typeof StreamingConnectionSchema>;

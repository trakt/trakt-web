import { z } from 'zod';

export const MediaNetworkSchema = z.object({
  name: z.string(),
});
export type MediaNetwork = z.infer<typeof MediaNetworkSchema>;

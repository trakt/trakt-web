import { z } from 'zod';

export const PortraitOfSchema = z.object({
  media: z.enum(['show', 'movie']),
  id: z.number(),
});

export type PortraitOf = z.infer<typeof PortraitOfSchema>;

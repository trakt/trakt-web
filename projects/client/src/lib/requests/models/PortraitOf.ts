import { z } from 'zod';

export const PortraitOfSchema = z.object({
  media: z.enum(['show', 'movie']),
  id: z.number(),
  season: z.number().optional(),
});

export type PortraitOf = z.infer<typeof PortraitOfSchema>;

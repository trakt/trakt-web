import { movieResponseSchema, showResponseSchema } from '@trakt/api';
import { z } from 'zod';

export const SmartListItemResponseSchema = z.object({
  rank: z.number(),
  type: z.string(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});

export type SmartListItemResponse = z.infer<typeof SmartListItemResponseSchema>;

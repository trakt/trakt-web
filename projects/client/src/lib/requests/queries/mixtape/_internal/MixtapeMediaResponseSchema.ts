import { movieResponseSchema, showResponseSchema } from '@trakt/api';
import { z } from 'zod';

export const MixtapeMediaResponseSchema = z.object({
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});

export type MixtapeMediaResponse = z.infer<typeof MixtapeMediaResponseSchema>;

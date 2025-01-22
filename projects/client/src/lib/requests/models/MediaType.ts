import { z } from 'zod';

export const MediaTypeSchema = z.enum(['movie', 'show']);
export type MediaType = z.infer<typeof MediaTypeSchema>;

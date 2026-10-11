import { z } from 'zod';

export const SmartListMediaTypeSchema = z.enum(['movies', 'shows', 'media']);

export type SmartListMediaType = z.infer<typeof SmartListMediaTypeSchema>;

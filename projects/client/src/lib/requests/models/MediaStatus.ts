import { mediaStatusSchema } from '@trakt/api';
import { z } from 'zod';

export const MediaStatusSchema = mediaStatusSchema.or(z.literal('unknown'));
export type MediaStatus = z.infer<typeof MediaStatusSchema> | 'unknown';

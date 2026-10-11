import { z } from 'zod';

export const SmartListSourceSchema = z.enum([
  'trending',
  'popular',
  'anticipated',
  'recommendations',
  'discover',
  'watchlist',
  'library',
]);

export type SmartListSource = z.infer<typeof SmartListSourceSchema>;

import { z } from 'zod';

export const ListTypeSchema = z.enum([
  'all',
  'personal',
  'official',
  'watchlist',
  'favorites',
]);

export type ListType = z.infer<typeof ListTypeSchema>;

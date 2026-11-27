import { z } from 'zod';

export const MovieLoreKindSchema = z.enum([
  'series',
  'adaptation',
  'rich_world',
  'true_story',
  'standalone',
]);

export type MovieLoreKind = z.infer<typeof MovieLoreKindSchema>;

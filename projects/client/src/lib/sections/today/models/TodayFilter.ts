import { z } from 'zod';

export const TodayFilterSchema = z.enum([
  'all',
  'mine',
  'watched',
  'rated',
  'comments',
]);
export type TodayFilter = z.infer<typeof TodayFilterSchema>;

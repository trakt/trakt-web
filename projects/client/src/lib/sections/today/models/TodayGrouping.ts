import { z } from 'zod';

export const TodayGroupingSchema = z.enum(['title', 'person']);
export type TodayGrouping = z.infer<typeof TodayGroupingSchema>;

import { z } from 'zod';

export const TodayGroupingSchema = z.enum(['time', 'title', 'person']);
export type TodayGrouping = z.infer<typeof TodayGroupingSchema>;

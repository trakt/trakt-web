import { z } from 'zod';

export const CalendarViewSchema = z.enum(['day', 'week']);
export type CalendarView = z.infer<typeof CalendarViewSchema>;

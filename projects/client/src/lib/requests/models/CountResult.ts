import { z } from 'zod';

export const CountResultSchema = z.object({
  count: z.number(),
});

export type CountResult = z.infer<typeof CountResultSchema>;

import { z } from 'zod';

export const SentimentsSchema = z.object({
  good: z.array(z.string()),
  bad: z.array(z.string()),
});

export type Sentiments = z.infer<typeof SentimentsSchema>;

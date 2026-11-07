import { z } from 'zod';

export const HypeReasonsSchema = z.object({
  series: z
    .object({
      films: z.array(
        z.object({
          ids: z.object({ trakt: z.number(), slug: z.string() }),
          title: z.string(),
          stars: z.number().int().min(1).max(10),
        }),
      ),
      usual: z.enum(['above', 'about', 'below']),
    })
    .nullish(),
  lists: z.object({ top: z.number().int().min(1).max(100) }).nullish(),
});

export type HypeReasons = z.infer<typeof HypeReasonsSchema>;

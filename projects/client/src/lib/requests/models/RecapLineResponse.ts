import { z } from 'zod';

export const RecapLineResponseSchema = z.object({
  text: z.string(),
  people: z.array(
    z.object({
      character: z.string().nullish(),
      person: z.object({
        ids: z.object({
          trakt: z.number(),
          slug: z.string(),
        }),
        name: z.string(),
        images: z
          .object({
            headshot: z.array(z.string()).nullish(),
          })
          .nullish(),
      }),
    }),
  ),
});

export type RecapLineResponse = z.infer<typeof RecapLineResponseSchema>;

import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const RecapLineSchema = z.object({
  key: z.string(),
  text: z.string(),
  people: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      character: z.string().nullable(),
      headshot: HttpsUrlSchema.nullable(),
    }),
  ),
});

export type RecapLine = z.infer<typeof RecapLineSchema>;

import { z } from 'zod';

export const UserMediaReactionsResponseSchema = z.array(z.object({
  id: z.number(),
  reaction: z.object({
    type: z.string(),
    emoji: z.string(),
  }),
}));

export type UserMediaReactionsResponse = z.infer<
  typeof UserMediaReactionsResponseSchema
>;

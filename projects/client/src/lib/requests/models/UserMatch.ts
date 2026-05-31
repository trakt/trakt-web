import { z } from 'zod';

export const UserMatchSharedSubgenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const UserMatchSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.object({
    subgenres: z.number().min(0).max(100),
    favorites: z.number().min(0).max(100),
  }),
  shared: z.object({
    subgenres: z.array(UserMatchSharedSubgenreSchema),
    favorites: z.object({
      movies: z.array(z.number()),
      shows: z.array(z.number()),
    }),
  }),
});

export type UserMatch = z.infer<typeof UserMatchSchema>;
export type UserMatchSharedSubgenre = z.infer<
  typeof UserMatchSharedSubgenreSchema
>;

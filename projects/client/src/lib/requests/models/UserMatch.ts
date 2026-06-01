import { z } from 'zod';

export const UserMatchSharedSubgenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  watchCount: z.number().optional(),
  /**
   * Globally-normalized rarity in [0, 1] from the TF-IDF corpus.
   * Higher = niche taste agreement. Omitted when the slug is absent
   * from the corpus (or the corpus is not yet built), so UI must
   * treat `undefined` as "no signal", not "common".
   */
  rarity: z.number().min(0).max(1).optional(),
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

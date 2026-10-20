import { z } from 'zod';

/** The highest tier index the member has seen per achievement, by id. */
export const SeenAchievementTiersSchema = z.record(z.string(), z.number());

export type SeenAchievementTiers = z.infer<typeof SeenAchievementTiersSchema>;

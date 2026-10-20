import { m } from '$lib/features/i18n/messages.ts';
import type { VipAchievementCategory } from '../models/VipAchievementCategory.ts';

type AchievementCategoryDefinition = {
  id: VipAchievementCategory;
  /** Localized section title (deferred so it re-resolves on locale change). */
  title: () => string;
};

/**
 * The drawer's sections, in display order. Every category an achievement uses
 * must appear here (`toAchievementSections.spec.ts` enforces it).
 */
export const achievementCategories: ReadonlyArray<
  AchievementCategoryDefinition
> = [
  { id: 'watching', title: m.vip_achievements_category_watching },
  { id: 'habits', title: m.vip_achievements_category_habits },
  { id: 'ratings', title: m.vip_achievements_category_ratings },
  { id: 'lists', title: m.vip_achievements_category_lists },
];

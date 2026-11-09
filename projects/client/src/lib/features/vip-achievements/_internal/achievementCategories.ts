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
export const achievementCategories: ReadonlyArray<AchievementCategoryDefinition> =
  [
    {
      id: 'getting-started',
      title: m.vip_achievements_category_getting_started,
    },
    { id: 'watching', title: m.vip_achievements_category_watching },
    { id: 'habits', title: m.vip_achievements_category_habits },
    { id: 'ratings', title: m.vip_achievements_category_ratings },
    { id: 'lists', title: m.vip_achievements_category_lists },
    { id: 'social', title: m.vip_achievements_category_social },
    { id: 'legacy', title: m.vip_achievements_category_legacy },
    { id: 'secret', title: m.vip_achievements_category_secret },
  ];

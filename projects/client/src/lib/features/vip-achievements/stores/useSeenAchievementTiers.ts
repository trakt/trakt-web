import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import {
  type SeenAchievementTiers,
  SeenAchievementTiersSchema,
} from '../_internal/SeenAchievementTiers.ts';
import type { VipAchievement } from '../models/VipAchievement.ts';

const STORAGE_KEY = 'trakt-achievements-seen';

function readSeen(): SeenAchievementTiers {
  try {
    const parsed = SeenAchievementTiersSchema.safeParse(
      JSON.parse(safeLocalStorage.getItem(STORAGE_KEY) ?? '{}'),
    );
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

/**
 * Remembers, per browser, the tier of each achievement the member has already
 * seen in the drawer, so only fresh unlocks get the "new" treatment.
 */
export function useSeenAchievementTiers() {
  return {
    readSeen,
    markSeen: (achievements: ReadonlyArray<VipAchievement>) => {
      const seen = Object.fromEntries(
        achievements
          .filter((achievement) => achievement.isUnlocked)
          .map((achievement) => [achievement.id, achievement.tierIndex]),
      );
      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    },
  };
}

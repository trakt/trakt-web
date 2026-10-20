import type { VipAchievementId } from '../models/VipAchievementId.ts';
import type { AchievementSection } from './toAchievementSections.ts';

export type AchievementCategorySectionProps = {
  section: AchievementSection;
  /** Position of each newly earned achievement in the drawer's reveal. */
  revealOrder: ReadonlyMap<VipAchievementId, number>;
  isOpen: boolean;
  onToggle: () => void;
};

import type { AchievementSection } from './toAchievementSections.ts';

export type AchievementCategorySectionProps = {
  section: AchievementSection;
  isOpen: boolean;
  onToggle: () => void;
};

import type { TodayMilestone } from '../models/TodayMilestone.ts';

const MILESTONE_RANK: Record<TodayMilestone['type'], number> = {
  'season-start': 1,
  'season-end': 2,
  'series-start': 3,
  'series-end': 4,
};

export function strongestMilestone(
  milestones: ReadonlyArray<TodayMilestone | Nil>,
): TodayMilestone | null {
  return milestones.reduce<TodayMilestone | null>((strongest, milestone) => {
    if (!milestone) return strongest;
    if (!strongest) return milestone;
    return MILESTONE_RANK[milestone.type] > MILESTONE_RANK[strongest.type]
      ? milestone
      : strongest;
  }, null);
}

const STREAK_MILESTONES = [7, 30, 100, 365] as const;

export function crossedStreakMilestone(
  previous: number,
  next: number,
): number | null {
  if (next !== previous + 1) return null;

  return STREAK_MILESTONES.find((milestone) => milestone === next) ?? null;
}

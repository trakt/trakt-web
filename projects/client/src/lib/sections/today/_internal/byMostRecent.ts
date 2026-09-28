export function byMostRecent(
  a: { activityAt: Date },
  b: { activityAt: Date },
): number {
  return b.activityAt.getTime() - a.activityAt.getTime();
}

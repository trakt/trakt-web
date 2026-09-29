import type { TodayTitleStory } from '../models/TodayTitleStory.ts';

export function pickHeroStory(
  stories: ReadonlyArray<TodayTitleStory>,
): TodayTitleStory | null {
  const milestone = stories.find((story) => story.milestone);
  if (milestone) return milestone;

  const [busiest] = stories.toSorted((a, b) => b.users.length - a.users.length);
  return busiest ?? null;
}

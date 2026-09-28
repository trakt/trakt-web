import type { TodayForYouItem } from '../models/TodayForYouItem.ts';
import type { TodayStoryGroup } from '../models/TodayStoryGroup.ts';

type IsStorySeenParams = {
  group: TodayStoryGroup;
  seenStories: Readonly<Record<string, number>>;
};

function releasedAt(item: TodayForYouItem): number {
  return item.type === 'up-next'
    ? item.entry.effectiveReleaseDate.getTime()
    : item.media.effectiveReleaseDate.getTime();
}

function latestActivityAt(group: TodayStoryGroup): number {
  if (group.type === 'title') return group.story.latestAt.getTime();

  return Math.max(
    0,
    ...group.frames.map((frame) =>
      frame.type === 'for-you' ? releasedAt(frame.item) : 0
    ),
  );
}

export function isStorySeen({ group, seenStories }: IsStorySeenParams) {
  const seenAt = seenStories[group.key];
  return seenAt != null && seenAt >= latestActivityAt(group);
}

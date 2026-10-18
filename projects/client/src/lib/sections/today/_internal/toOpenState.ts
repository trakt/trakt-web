import type { TodayStoryGroup } from '../models/TodayStoryGroup.ts';
import { isStorySeen } from './isStorySeen.ts';

type ToOpenStateParams = {
  groups: ReadonlyArray<TodayStoryGroup>;
  seenStories: Readonly<Record<string, number>>;
};

export function toOpenState({ groups, seenStories }: ToOpenStateParams) {
  const hasUnseen = groups.some(
    (group) => !isStorySeen({ group, seenStories }),
  );

  return hasUnseen ? 'unseen' : 'seen';
}

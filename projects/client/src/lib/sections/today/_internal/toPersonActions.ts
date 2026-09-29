import type { TodayPersonAction } from '../models/TodayPersonAction.ts';
import type { TodayTitleStory } from '../models/TodayTitleStory.ts';
import { byMostRecent } from './byMostRecent.ts';

export function toPersonActions(
  stories: ReadonlyArray<TodayTitleStory>,
): TodayPersonAction[] {
  return stories
    .flatMap((story) =>
      story.actions.map((action): TodayPersonAction => ({
        ...action,
        media: story.media,
      }))
    )
    .toSorted(byMostRecent);
}

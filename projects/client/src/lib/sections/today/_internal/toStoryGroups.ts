import type { TodayForYouItem } from '../models/TodayForYouItem.ts';
import type { TodayStoryFrame } from '../models/TodayStoryFrame.ts';
import type { TodayStoryGroup } from '../models/TodayStoryGroup.ts';
import type { TodayTitleStory } from '../models/TodayTitleStory.ts';

const FOR_YOU_STORY_KEY = 'for-you';

type ToStoryGroupsParams = {
  forYou: ReadonlyArray<TodayForYouItem>;
  titles: ReadonlyArray<TodayTitleStory>;
};

function toTitleFrames(story: TodayTitleStory): TodayStoryFrame[] {
  const friendFrames = story.actions.map((action): TodayStoryFrame => ({
    key: `${story.key}-${action.key}`,
    type: 'friend',
    story,
    action,
  }));

  if (story.users.length < 2) return friendFrames;

  return [
    { key: `${story.key}-summary`, type: 'summary', story },
    ...friendFrames,
  ];
}

export function toStoryGroups(
  { forYou, titles }: ToStoryGroupsParams,
): TodayStoryGroup[] {
  const titleGroups = titles.map((story): TodayStoryGroup => ({
    key: story.key,
    type: 'title',
    story,
    frames: toTitleFrames(story),
  }));

  if (forYou.length === 0) return titleGroups;

  return [
    {
      key: FOR_YOU_STORY_KEY,
      type: 'for-you',
      frames: forYou.map((item) => ({ key: item.key, type: 'for-you', item })),
    },
    ...titleGroups,
  ];
}

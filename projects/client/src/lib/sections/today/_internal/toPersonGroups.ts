import type { TodayPersonGroup } from '../models/TodayPersonGroup.ts';
import type { TodayTitleStory } from '../models/TodayTitleStory.ts';
import { toPersonActions } from './toPersonActions.ts';

export function toPersonGroups(
  stories: ReadonlyArray<TodayTitleStory>,
): TodayPersonGroup[] {
  const byPerson = toPersonActions(stories)
    .reduce((groups, action) => {
      const actions = groups.get(action.user.key)?.actions ?? [];
      return groups.set(action.user.key, {
        user: action.user,
        actions: [...actions, action],
      });
    }, new Map<string, Pick<TodayPersonGroup, 'user' | 'actions'>>());

  return Array.from(byPerson.entries())
    .map(([key, { user, actions }]) => ({
      key,
      user,
      actions,
      latestAt: actions.at(0)?.activityAt ?? new Date(0),
    }))
    .toSorted((a, b) => b.latestAt.getTime() - a.latestAt.getTime());
}

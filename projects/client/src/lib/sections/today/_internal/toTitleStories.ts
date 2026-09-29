import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import type { TodayFriendAction } from '../models/TodayFriendAction.ts';
import type { TodayMedia } from '../models/TodayMedia.ts';
import type { TodayTitleStory } from '../models/TodayTitleStory.ts';
import { byMostRecent } from './byMostRecent.ts';
import { isTitleRating } from './isTitleRating.ts';
import { strongestMilestone } from './strongestMilestone.ts';
import { toMilestone } from './toMilestone.ts';

type MediaAction = { media: TodayMedia; action: TodayFriendAction };
type TitleGroup = { media: TodayMedia; actions: TodayFriendAction[] };

function toMedia({ target }: FollowingActivity): TodayMedia {
  return target.type === 'movie' ? target.movie : target.show;
}

function toMediaAction(activity: FollowingActivity): MediaAction {
  const { target, detail } = activity;
  const episode = target.type === 'episode' ? target.episode : null;

  return {
    media: toMedia(activity),
    action: {
      key: activity.key,
      kind: detail.action,
      target: target.type,
      user: activity.user,
      activityAt: activity.activityAt,
      rating: detail.action === 'rating' ? detail.rating : null,
      comment: detail.action === 'comment' ? detail.comment : null,
      episode,
      episodeCount: episode ? 1 : 0,
      season: target.type === 'season' ? target.season : null,
      milestone: detail.action === 'watch' ? toMilestone(episode) : null,
    },
  };
}

function mergeWatches(
  actions: ReadonlyArray<TodayFriendAction>,
): TodayFriendAction[] {
  const merged = actions.toSorted(byMostRecent).reduce((result, action) => {
    const key = `${action.user.key}-${action.target}`;
    const earlier = result.get(key);

    if (action.kind !== 'watch' || action.target !== 'episode') {
      return result.set(action.key, action);
    }

    if (!earlier) return result.set(key, action);

    return result.set(key, {
      ...earlier,
      episodeCount: earlier.episodeCount + action.episodeCount,
      milestone: strongestMilestone([earlier.milestone, action.milestone]),
    });
  }, new Map<string, TodayFriendAction>());

  return Array.from(merged.values()).toSorted(byMostRecent);
}

function toAverageRating(
  actions: ReadonlyArray<TodayFriendAction>,
): number | null {
  const ratings = dedupe(
    (action) => action.user.key,
    actions.filter(isTitleRating),
  ).map((action) => action.rating ?? 0);

  if (ratings.length === 0) return null;

  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

function toTitleStory(group: TitleGroup): TodayTitleStory {
  const { media } = group;
  const actions = mergeWatches(group.actions);

  return {
    key: media.key,
    media,
    actions,
    users: dedupe((user) => user.key, actions.map((action) => action.user)),
    averageRating: toAverageRating(actions),
    milestone: strongestMilestone(actions.map((action) => action.milestone)),
    latestAt: actions.at(0)?.activityAt ?? new Date(0),
  };
}

export function toTitleStories(
  activities: ReadonlyArray<FollowingActivity>,
): TodayTitleStory[] {
  const byTitle = dedupe((activity) => activity.key, [...activities])
    .map(toMediaAction)
    .reduce((groups, { media, action }) => {
      const actions = groups.get(media.key)?.actions ?? [];
      return groups.set(media.key, { media, actions: [...actions, action] });
    }, new Map<string, TitleGroup>());

  return Array.from(byTitle.values())
    .map(toTitleStory)
    .toSorted((a, b) => b.latestAt.getTime() - a.latestAt.getTime());
}

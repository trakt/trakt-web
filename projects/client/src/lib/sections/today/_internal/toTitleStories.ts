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

type RatingMatch = { watch: TodayFriendAction; rating: TodayFriendAction };

function isRatingOfWatch({ watch, rating }: RatingMatch): boolean {
  if (watch.kind !== 'watch' || rating.kind !== 'rating') return false;
  if (watch.user.key !== rating.user.key) return false;
  if (watch.target !== rating.target) return false;
  if (watch.episodeCount > 1) return false;

  return watch.episode?.id === rating.episode?.id;
}

function mergeRatings(
  actions: ReadonlyArray<TodayFriendAction>,
): TodayFriendAction[] {
  const ratedWatches = actions.reduce((result, rating) => {
    const watch = actions.find((candidate) =>
      isRatingOfWatch({ watch: candidate, rating }),
    );
    if (!watch || result.has(watch.key)) return result;

    return result.set(watch.key, rating);
  }, new Map<string, TodayFriendAction>());

  const foldedRatings = new Set(
    Array.from(ratedWatches.values()).map((rating) => rating.key),
  );

  return actions
    .filter((action) => !foldedRatings.has(action.key))
    .map((action) => {
      const rating = ratedWatches.get(action.key);
      return rating ? { ...action, rating: rating.rating } : action;
    });
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
  const actions = mergeRatings(mergeWatches(group.actions));

  return {
    key: media.key,
    media,
    actions,
    users: dedupe(
      (user) => user.key,
      actions.map((action) => action.user),
    ),
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

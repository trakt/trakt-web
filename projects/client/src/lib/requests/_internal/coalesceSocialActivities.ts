import { time } from '$lib/utils/timing/time.ts';
import type { SocialActivity } from '../models/SocialActivity.ts';
import { coalesceBinges } from './coalesceBinges.ts';

export const ACTIVITY_COALESCE_WINDOW = time.minutes(10);

function isSameMovie(
  activityA: SocialActivity,
  activityB: SocialActivity,
): boolean {
  if (activityA.type !== 'movie' || activityB.type !== 'movie') {
    return false;
  }

  return activityA.movie.id === activityB.movie.id;
}

function isSameEpisode(
  activityA: SocialActivity,
  activityB: SocialActivity,
): boolean {
  if (activityA.type !== 'episode' || activityB.type !== 'episode') {
    return false;
  }

  return activityA.show.id === activityB.show.id &&
    activityA.episode.id === activityB.episode.id;
}

function isSimilarActivity(
  activityA: SocialActivity,
  activityB: SocialActivity,
): boolean {
  const isSameMedia = isSameMovie(activityA, activityB) ||
    isSameEpisode(activityA, activityB);

  if (!isSameMedia) return false;

  const timeDifference = Math.abs(
    activityA.activityAt.getTime() - activityB.activityAt.getTime(),
  );
  return timeDifference <= ACTIVITY_COALESCE_WINDOW;
}

export function coalesceSocialActivities(
  activities: SocialActivity[],
): SocialActivity[] {
  const coalescedActivities = coalesceBinges(activities);
  const ratingsMap = new Map<SocialActivity, number[]>();

  return coalescedActivities.reduce((acc, activity) => {
    const similarActivity = acc.find((currentActivity) =>
      isSimilarActivity(currentActivity, activity)
    );

    if (similarActivity) {
      const allUsers = [...activity.users, ...similarActivity.users];
      const uniqueUsers = new Map(
        allUsers.map((user) => [user.slug, user]),
      );
      similarActivity.users = Array.from(uniqueUsers.values());

      const currentRatings = ratingsMap.get(similarActivity) ?? [];
      const ratings = activity.rating != null
        ? [...currentRatings, activity.rating]
        : currentRatings;
      ratingsMap.set(similarActivity, ratings);

      similarActivity.rating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : similarActivity.rating;

      return acc;
    }

    const initialRatings = activity.rating != null ? [activity.rating] : [];
    ratingsMap.set(activity, initialRatings);

    acc.push(activity);
    return acc;
  }, [] as SocialActivity[]);
}

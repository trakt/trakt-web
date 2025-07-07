import { time } from '$lib/utils/timing/time.ts';
import type { SocialActivity } from '../models/SocialActivity.ts';

const ACTIVITY_COALESCE_WINDOW = time.minutes(10);

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
  return activities.reduce((acc, activity) => {
    const similarActivity = acc.find((currentActivity) =>
      isSimilarActivity(currentActivity, activity)
    );

    if (similarActivity) {
      similarActivity.users = [...activity.users, ...similarActivity.users];
      return acc;
    }

    acc.push(activity);
    return acc;
  }, [] as SocialActivity[]);
}

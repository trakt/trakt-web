import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import type {
  EpisodeActivity,
  SocialActivity,
} from '../models/SocialActivity.ts';
import { coalesceEpisodes } from './coalesceEpisodes.ts';

function groupEpisodeActivities(activities: EpisodeActivity[]) {
  return activities.reduce((acc, activity) => {
    const userKey = activity.users.map((u) => u.slug).join(',');
    const dayKey = getDayKey(activity.activityAt);
    const key = `${activity.episode.show.id}_${userKey}_${dayKey}`;

    acc[key] = acc[key] ? [...acc[key], activity] : [activity];
    return acc;
  }, {} as Record<string, EpisodeActivity[]>);
}

export function coalesceBinges(activities: SocialActivity[]): SocialActivity[] {
  const episodeActivities = activities.filter((activity) =>
    activity.type === 'episode'
  );

  const groupedActivities = groupEpisodeActivities(episodeActivities);

  const coalescedEpisodes = Object.values(groupedActivities).flatMap(
    (group) => {
      if (group.length === 1) {
        return group;
      }

      const groupActivity = assertDefined(group.at(0));
      const episodesInGroup = group.map((activity) => activity.episode);
      const coalesced = coalesceEpisodes(
        episodesInGroup,
        () => getDayKey(groupActivity.activityAt),
      );

      const coalescedActivities = coalesced.map((ep) => {
        const latestActivity = assertDefined(
          group.find((a) => a.episode.id === ep.id),
        );
        return {
          ...latestActivity,
          episode: ep,
        };
      });

      return coalescedActivities;
    },
  );

  return [
    ...activities.filter((activity) => activity.type === 'movie'),
    ...coalescedEpisodes,
  ].sort((a, b) => b.activityAt.getTime() - a.activityAt.getTime());
}

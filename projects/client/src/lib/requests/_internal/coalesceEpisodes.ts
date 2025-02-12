import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeComputedType } from '../models/EpisodeType.ts';
import type { UpcomingEpisodeEntry } from '../queries/calendars/upcomingEpisodesQuery.ts';

export function coalesceEpisodes(episodes: UpcomingEpisodeEntry[]) {
  const grouped = episodes.reduce(
    (acc, episode) => {
      const key = `${episode.show.id}-${episode.season}`;
      acc[key] ??= {
        episodes: [],
        show: episode.show,
        season: episode.season,
      };
      acc[key].episodes.push(episode);
      return acc;
    },
    {} as Record<
      string,
      {
        episodes: typeof episodes;
        show: typeof episodes[0]['show'];
        season: number;
      }
    >,
  );

  const coalesced = Object.values(grouped).flatMap((
    { episodes, show, season },
  ) => {
    const hasSeasonPremiere = episodes.some((ep) =>
      ep.type === 'season_premiere'
    );
    const hasSeasonFinale = episodes.some((ep) => ep.type === 'season_finale');

    if (hasSeasonPremiere && hasSeasonFinale) {
      return [{
        ...assertDefined(episodes[0]),
        type: EpisodeComputedType.full_season,
        season,
        show,
      }];
    }

    return episodes;
  });

  return coalesced.sort((a, b) => a.airDate.getTime() - b.airDate.getTime());
}

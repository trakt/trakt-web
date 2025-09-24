import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type EpisodeProgressEntry,
  EpisodeProgressEntrySchema,
} from '$lib/requests/models/EpisodeProgressEntry.ts';
import {
  type EpisodeType,
  EpisodeUnknownType,
} from '$lib/requests/models/EpisodeType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { ShowProgressResponse } from '@trakt/api';
import { mapToPostCredits } from '../../_internal/mapToPostCredits.ts';

const showProgressRequest = (
  { fetch, slug }: { slug: string } & ApiParams,
) =>
  api({ fetch })
    .shows
    .progress
    .watched({
      query: {
        count_specials: false,
        specials: false,
        hidden: false,
        extended: 'full,images',
        include_stats: true,
      },
      params: {
        id: slug,
      },
    });

function mapShowProgressResponse(
  item: ShowProgressResponse,
): EpisodeProgressEntry {
  const episode = item.next_episode;
  const posterCandidate = findDefined(...(episode.images?.screenshot ?? []));

  const airDate = new Date(episode.first_aired ?? MAX_DATE);

  return {
    id: episode.ids.trakt,
    title: episode.title,
    season: episode.season,
    number: episode.number,
    runtime: episode.runtime ?? NaN,
    cover: {
      url: prependHttps(posterCandidate),
    },
    airDate,
    total: item.aired,
    completed: item.completed,
    remaining: item.aired - item.completed,
    minutesLeft: item.stats?.minutes_left ?? 0,
    type: episode.episode_type as EpisodeType ?? EpisodeUnknownType.unknown,
    genres: [],
    overview: episode.overview ?? '',
    year: airDate.getFullYear(),
    postCredits: mapToPostCredits(episode),
  };
}

export const showProgressQuery = defineQuery({
  key: 'showProgress',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (params) => [params.slug],
  request: showProgressRequest,
  mapper: (response) => mapShowProgressResponse(response.body),
  schema: EpisodeProgressEntrySchema,
  ttl: time.days(1),
});

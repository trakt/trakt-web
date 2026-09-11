import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import type { EpisodeTypeFilter } from '../models/EpisodeTypeFilter.ts';

const FEED_TOKEN_PARAM = 'slurm';

type ToCalendarFeedUrlParams = {
  environment: string;
  token: string;
  mode: DiscoverMode;
  episodeType: EpisodeTypeFilter;
  filters: Record<string, string>;
};

function feedPath(
  { mode, episodeType }: Pick<ToCalendarFeedUrlParams, 'mode' | 'episodeType'>,
): string {
  if (mode === 'movie') return 'my/movies';
  if (episodeType === 'premieres') return 'my/shows/premieres';
  if (episodeType === 'finales') return 'my/shows/finales';
  return mode === 'media' ? 'my/media' : 'my/shows';
}

export function toCalendarFeedUrl(
  { environment, token, mode, episodeType, filters }: ToCalendarFeedUrlParams,
): { https: string; webcal: string } {
  const path = feedPath({ mode, episodeType });
  const query = buildParamString({ [FEED_TOKEN_PARAM]: token, ...filters });
  const https = `${environment}/calendars/${path}.ics${query}`;

  return { https, webcal: https.replace(/^https?:/, 'webcal:') };
}

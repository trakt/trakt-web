import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import type { MediaInfo } from './MediaInfo.ts';

type CreateMediaLdParams = {
  type: ExtendedMediaType;
  title: string;
  url: string;
  description: string;
  image: string | Nil;
  info: MediaInfo | Nil;
};

const TRAKT_RATING_SCALE = 10;

const toAggregateRating = (info: MediaInfo | Nil) => {
  const { rating, votes } = info ?? {};

  if (!rating || !votes) {
    return {};
  }

  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (rating * TRAKT_RATING_SCALE).toFixed(1),
      ratingCount: votes,
      bestRating: String(TRAKT_RATING_SCALE),
      worstRating: '1',
    },
  };
};

const toDateModified = (updatedAt: Date | Nil) =>
  updatedAt ? { dateModified: updatedAt.toISOString() } : {};

const toDatePublished = (year: number | Nil) =>
  year ? { datePublished: String(year) } : {};

const toGenres = (genres: ReadonlyArray<string> | undefined) => {
  const labels = genres?.map((genre) => toTranslatedGenre(genre)) ?? [];
  return labels.length > 0 ? { genre: labels } : {};
};

const toDuration = (runtime: number | undefined) =>
  runtime && runtime > 0 ? { duration: `PT${runtime}M` } : {};

const toContentRating = (certification: string | Nil) =>
  certification ? { contentRating: certification } : {};

const SCHEMAS: Record<
  ExtendedMediaType,
  { type: string; details: (info: MediaInfo | Nil) => Record<string, unknown> }
> = {
  movie: {
    type: 'Movie',
    details: (info) => ({
      ...toDatePublished(info?.year),
      ...toGenres(info?.genres),
      ...toDuration(info?.runtime),
      ...toContentRating(info?.certification),
      ...toAggregateRating(info),
    }),
  },
  show: {
    type: 'TVSeries',
    details: (info) => ({
      ...toDatePublished(info?.year),
      ...toGenres(info?.genres),
      ...toAggregateRating(info),
    }),
  },
  episode: {
    type: 'TVEpisode',
    // FIXME: extend with season and episode information
    details: () => ({}),
  },
};

export function createMediaLd({
  type,
  title,
  url,
  description,
  image,
  info,
}: CreateMediaLdParams): string {
  const schema = SCHEMAS[type];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': schema.type,
    name: title,
    description,
    image,
    url,
    ...toDateModified(info?.updatedAt),
    ...schema.details(info),
  });
}

import type {
  SyncItem,
  SyncItemTraktReference,
} from '$lib/requests/models/SyncItem.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { SyncItemResponse } from '@trakt/api';

type TraktItem = NonNullable<SyncItemResponse['trakt_item']>;

function padNumber(value: number): string {
  return value.toString().padStart(2, '0');
}

function mapTraktReference(
  traktItem: TraktItem | Nil,
): SyncItemTraktReference | undefined {
  if (!traktItem) {
    return undefined;
  }

  switch (traktItem.type) {
    case 'movie':
      return {
        label: `${traktItem.title} (${traktItem.year})`,
        url: UrlBuilder.movie(traktItem.ids.slug),
      };
    case 'show':
      return {
        label: `${traktItem.title} (${traktItem.year})`,
        url: UrlBuilder.show(traktItem.ids.slug),
      };
    case 'episode': {
      const code = `S${padNumber(traktItem.season)}E${
        padNumber(traktItem.number)
      }`;
      const showTitle = traktItem.show?.title;
      return {
        label: showTitle
          ? `${showTitle} ${code}: ${traktItem.title}`
          : `${code}: ${traktItem.title}`,
        url: traktItem.show
          ? UrlBuilder.episode(
            traktItem.show.ids.slug,
            traktItem.season,
            traktItem.number,
          )
          : undefined,
      };
    }
  }
}

export function mapToSyncItem(
  item: SyncItemResponse,
  index: number,
): SyncItem {
  return {
    key: `sync-item-${index}-${item.content_id ?? item.tmdb_id ?? 'unknown'}`,
    kind: item.kind,
    type: item.type,
    serviceId: item.service_id,
    contentId: item.content_id,
    tmdbId: item.tmdb_id,
    tmdbSeriesId: item.tmdb_series_id,
    watchedAt: item.watched_at ? new Date(item.watched_at) : undefined,
    ratedAt: item.rated_at ? new Date(item.rated_at) : undefined,
    progress: item.progress,
    ratingValue: item.rating_value,
    traktItem: mapTraktReference(item.trakt_item),
  };
}

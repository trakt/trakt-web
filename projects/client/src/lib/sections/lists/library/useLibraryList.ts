import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { makeTargets } from '$lib/features/intl-overlay/makeTargets.ts';
import { withBulkIntlOverlay } from '$lib/features/intl-overlay/withBulkIntlOverlay.ts';
import type { LibraryItem } from '$lib/requests/models/LibraryItem.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { Library } from './models/Library.ts';

type UseLibraryListProps = PaginationParams & {
  library: Library;
  type?: DiscoverMode;
};

const libraryItemTargets = makeTargets<LibraryItem>(
  {
    get: (item) =>
      item.type === 'movie' ? { id: item.media.id, type: 'movie' } : null,
    patch: (item, title) =>
      item.type === 'movie'
        ? { ...item, media: { ...item.media, title } }
        : item,
  },
  {
    get: (item) =>
      item.type === 'episode' ? { id: item.media.id, type: 'show' } : null,
    patch: (item, title) =>
      item.type === 'episode'
        ? { ...item, media: { ...item.media, title } }
        : item,
  },
  {
    get: (item) =>
      item.type === 'episode' ? { id: item.episode.id, type: 'episode' } : null,
    patch: (item, title) =>
      item.type === 'episode'
        ? { ...item, episode: { ...item.episode, title } }
        : item,
  },
);

export function useLibraryList(props: UseLibraryListProps) {
  const { list, ...rest } = usePaginatedListQuery(libraryQuery({
    page: props.page ?? 1,
    limit: props.limit ?? DEFAULT_PAGE_SIZE,
    availableOn: props.library,
    type: props.type,
  }));

  return {
    list: list.pipe(
      withBulkIntlOverlay({ getTargets: libraryItemTargets }),
    ),
    ...rest,
  };
}

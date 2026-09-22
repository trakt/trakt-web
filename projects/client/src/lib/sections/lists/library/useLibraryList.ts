import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { makeTargets } from '$lib/features/intl-overlay/makeTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { LibraryItem } from '$lib/requests/models/LibraryItem.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { useCollectedRefresh } from '$lib/stores/useCollectedRefresh.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { firstValueFrom, startWith, switchMap } from 'rxjs';
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
  const refreshed = useCollectedRefresh({ refetchType: 'none' });

  const { list: baseList, isLoading: baseLoading, hasNextPage, fetchNextPage } =
    usePaginatedListQuery({
      ...libraryQuery({
        page: props.page ?? 1,
        limit: props.limit ?? DEFAULT_PAGE_SIZE,
        availableOn: props.library,
        type: props.type,
      }),
      refetchOnMount: 'always',
      persister: undefined,
    });

  const overlay = createBulkIntlOverlay<LibraryItem>({
    getTargets: libraryItemTargets,
  });

  return {
    list: refreshed.pipe(switchMap(() => baseList), overlay.operator),
    isLoading: refreshed.pipe(
      switchMap(() => withOverlayLoading(baseLoading, overlay.intlLoading$)),
      startWith(true),
    ),
    hasNextPage: refreshed.pipe(
      switchMap(() => hasNextPage),
      startWith(false),
    ),
    fetchNextPage: async () => {
      await firstValueFrom(refreshed);
      await fetchNextPage();
    },
  };
}

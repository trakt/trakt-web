import { useQuery } from '$lib/features/query/useQuery.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type LibraryItem,
  libraryQuery,
} from '$lib/requests/queries/sync/libraryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  shareReplay,
  take,
} from 'rxjs';
import { useInMemoryPagination } from '../../../stores/useInMemoryPagination.ts';
import { CUSTOM_LIBRARY_NAME } from './constants/index.ts';

type UseLibraryListProps = PaginationParams & {
  library?: string;
};

export function useLibraryList(props: UseLibraryListProps) {
  const queryObservable = useQuery(libraryQuery()).pipe(shareReplay(1));

  const record = queryObservable.pipe(
    map((query) =>
      (query.data ?? []).toSorted((a, b) =>
        b.addedAt.getTime() - a.addedAt.getTime()
      ).reduce((acc, item) => {
        const addType = (type: string) => {
          acc[type] = acc[type] || [];
          acc[type].push(item);
        };

        if (item.availableOn.length === 0) {
          addType(CUSTOM_LIBRARY_NAME);
          return acc;
        }

        item.availableOn.forEach(addType);
        return acc;
      }, {} as Record<string, LibraryItem[]>)
    ),
    shareReplay(1),
  );

  const libraries = record.pipe(
    map((r) => Object.keys(r) as string[]),
  );

  const activeLibrary = new BehaviorSubject<string>(CUSTOM_LIBRARY_NAME);

  record
    .pipe(
      filter((r) => Object.keys(r).length > 0),
      take(1),
      map((r) => {
        const keys = Object.keys(r);
        if (props.library && keys.includes(props.library)) {
          return props.library;
        }

        return keys.at(0);
      }),
    )
    .subscribe((library) => {
      activeLibrary.next(library ?? CUSTOM_LIBRARY_NAME);
    });

  const items = combineLatest([record, activeLibrary])
    .pipe(
      map(([r, active]) => r[active] ?? []),
      shareReplay(1),
    );

  const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(items, {
    page: props.page,
    limit: props.limit,
  });

  return {
    activeLibrary,
    libraries,
    list,
    hasNextPage,
    fetchNextPage,
    isLoading: queryObservable.pipe(
      map(toLoadingState),
    ),
  };
}

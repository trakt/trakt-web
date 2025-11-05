import { combineLatest, map, shareReplay, take } from 'rxjs';
import { writable } from 'svelte/store';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type LibraryItem,
  libraryQuery,
} from '$lib/requests/queries/sync/libraryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { paginate } from '../recommended/paginate.ts';
import { CUSTOM_LIBRARY_NAME } from './constants/index.ts';

type UseLibraryListProps = PaginationParams & {
  library?: string;
};

export function useLibraryList(props: UseLibraryListProps) {
  const queryObservable = toObservable(
    useQuery(libraryQuery()),
  ).pipe(shareReplay(1));

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

  const initialType = record.pipe(
    map((r) => {
      const keys = Object.keys(r);
      if (props.library && keys.includes(props.library)) {
        return props.library;
      }

      return keys.at(0);
    }),
  );

  const activeLibrary = writable<string>(CUSTOM_LIBRARY_NAME);
  initialType
    .pipe(take(1))
    .subscribe((library) => {
      activeLibrary.set(library ?? CUSTOM_LIBRARY_NAME);
    });

  const items = combineLatest([record, toObservable(activeLibrary)])
    .pipe(
      map(([r, active]) => r[active] ?? []),
    );

  const page = items.pipe(
    map((list) => ({
      current: props.page,
      total: Math.ceil(list.length / props.limit),
    })),
  );

  return {
    activeLibrary,
    libraries,
    page,
    list: items.pipe(paginate({ page: props.page, limit: props.limit })),
    isLoading: queryObservable.pipe(
      map(toLoadingState),
    ),
  };
}

import * as m from '$lib/features/i18n/messages.ts';
import type { ListUrlBuilder } from '$lib/sections/lists/user/models/ListUrlBuilder.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { Sorting } from '$lib/sections/lists/user/models/Sorting.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { BehaviorSubject, map, type Observable } from 'rxjs';

export const UP_NEXT_SORT_OPTIONS: Sorting[] = [
  {
    value: undefined,
    text: m.button_text_sort_default,
    label: m.button_label_sort_default,
  },
  {
    value: 'released',
    text: m.button_text_sort_release_date,
    label: m.button_label_sort_release_date,
  },
  {
    value: 'remaining',
    text: m.button_text_sort_remaining,
    label: m.button_label_sort_remaining,
  },
];

type UpNextSorting = {
  current: Observable<{
    sorting: Sorting;
    sortHow: SortDirection;
  }>;
  options: Sorting[];
  update: (params: Record<string, string>) => void;
  urlBuilder: ListUrlBuilder;
};

function mapToDirection(value: string | Nil): SortDirection | undefined {
  return value === 'asc' || value === 'desc' ? value : undefined;
}

function mapToSortBy(value: string | Nil): Sorting['value'] {
  return UP_NEXT_SORT_OPTIONS.find((option) => option.value === value)?.value;
}

export function useUpNextSorting(user: string): UpNextSorting {
  const params = new BehaviorSubject<Record<string, string | null>>({
    sort_by: null,
    sort_how: null,
  });

  function update(newParams: Record<string, string>) {
    params.next({ ...newParams });
  }

  return {
    update,
    options: UP_NEXT_SORT_OPTIONS,
    current: params.pipe(
      map(($params) => {
        const sortBy = mapToSortBy($params.sort_by);
        const sortHow = mapToDirection($params.sort_how) ?? 'asc';

        const sorting = UP_NEXT_SORT_OPTIONS.find(
          (option) => option.value === sortBy,
        ) ?? UP_NEXT_SORT_OPTIONS[0];

        return { sorting, sortHow };
      }),
    ),
    urlBuilder: ({ sortBy, sortHow }) => {
      return UrlBuilder.progress(user, {
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(sortHow ? { sort_how: sortHow } : {}),
      });
    },
  };
}

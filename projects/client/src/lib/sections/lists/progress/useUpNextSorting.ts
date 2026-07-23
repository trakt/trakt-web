import { page } from '$app/state';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import type { ListUrlBuilder } from '$lib/sections/lists/user/models/ListUrlBuilder.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { Sorting } from '$lib/sections/lists/user/models/Sorting.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import {
  BehaviorSubject,
  combineLatest,
  map,
  type Observable,
  startWith,
} from 'rxjs';

const upNextSortOptions: Sorting<UpNextSortBy>[] = [
  {
    value: undefined,
    text: m.button_text_sort_default,
    label: m.button_label_sort_default,
  },
  {
    value: 'smart',
    text: m.button_text_sort_smart,
    label: m.button_label_sort_smart,
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
    sorting: Sorting<UpNextSortBy>;
    sortHow: SortDirection;
  }>;
  options: Observable<Sorting<UpNextSortBy>[]>;
  update: (params: Record<string, string>) => void;
  urlBuilder: ListUrlBuilder<UpNextSortBy>;
};

function mapToDirection(value: string | Nil): SortDirection | undefined {
  return value === 'asc' || value === 'desc' ? value : undefined;
}

function getSortOptions(
  isSmartSortEnabled: boolean,
): Sorting<UpNextSortBy>[] {
  return isSmartSortEnabled
    ? upNextSortOptions
    : upNextSortOptions.filter((option) => option.value !== 'smart');
}

function mapToSortBy(
  value: string | Nil,
  options: Sorting<UpNextSortBy>[],
): UpNextSortBy | undefined {
  return options.find((option) => option.value === value)?.value;
}

export function useUpNextSorting(user: string): UpNextSorting {
  const { isEnabled } = useFeatureFlag();
  const options = isEnabled(FeatureFlag.UpNextSmartSort).pipe(
    map(getSortOptions),
    startWith(getSortOptions(false)),
  );

  // Seeded from the URL so the first fetch already uses the requested sort.
  const params = new BehaviorSubject<Record<string, string | null>>({
    sort_by: page.url.searchParams.get('sort_by'),
    sort_how: page.url.searchParams.get('sort_how'),
  });

  function update(newParams: Record<string, string>) {
    params.next({ ...newParams });
  }

  return {
    update,
    options,
    current: combineLatest([params, options]).pipe(
      map(([$params, $options]) => {
        const sortBy = mapToSortBy($params.sort_by, $options);
        const sortHow = mapToDirection($params.sort_how);

        const sorting = $options.find(
          (option) => option.value === sortBy,
        );

        return {
          sorting: assertDefined(
            sorting,
            'Expected valid up-next sorting option',
          ),
          sortHow: sortHow ?? 'desc',
        };
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

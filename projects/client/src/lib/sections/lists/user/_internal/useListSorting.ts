import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { BehaviorSubject, map, type Observable } from 'rxjs';
import { assertDefined } from '../../../../utils/assert/assertDefined.ts';
import { getListUrl } from '../../components/list-summary/_internal/getListUrl.ts';
import { LIST_SORT_OPTIONS } from '../constants/index.ts';
import type {
  ListUrlBuilder,
  ListUrlBuilderParams,
} from '../models/ListUrlBuilder.ts';
import type { SortBy } from '../models/SortBy.ts';
import type { SortDirection } from '../models/SortDirection.ts';
import type { Sorting } from '../models/Sorting.ts';

function mapToDirection(value: string | Nil): SortDirection | undefined {
  return value === 'asc' || value === 'desc' ? value : undefined;
}

function mapToSortBy(value: string | Nil): SortBy | undefined {
  const sortBy = LIST_SORT_OPTIONS.find((option) => option.value === value);
  return sortBy ? sortBy.value : undefined;
}

type ListSorting = {
  current: Observable<{
    sorting: Sorting;
    sortHow: SortDirection;
  }>;
  options: Sorting[];
  update: (params: Record<string, string>) => void;
  urlBuilder: ListUrlBuilder;
};

export function useListSorting(
  list: MediaListSummary,
  type?: MediaType,
): ListSorting {
  const params = new BehaviorSubject<Record<string, string | null>>({
    sort_by: null,
    sort_how: null,
  });

  function update(newParams: Record<string, string>) {
    params.next({ ...params.value, ...newParams });
  }

  return {
    update,
    options: LIST_SORT_OPTIONS,
    current: params.pipe(
      map(($params) => {
        const sortBy = mapToSortBy($params.sort_by);
        const sortHow = mapToDirection($params.sort_how) ?? list.sortHow;

        const sorting = LIST_SORT_OPTIONS.find(
          (option) => option.value === sortBy,
        );

        return {
          sorting: assertDefined(sorting, 'Expected valid sorting option'),
          sortHow,
        };
      }),
    ),
    urlBuilder: ({ sortBy, sortHow }: ListUrlBuilderParams) => {
      return getListUrl(list, { mode: type, sortBy, sortHow });
    },
  };
}

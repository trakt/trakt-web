import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { BehaviorSubject, map, type Observable } from 'rxjs';
import { userListsSortOptions } from './constants/userListsSortOptions.ts';
import type {
  ListUrlBuilder,
  ListUrlBuilderParams,
} from './models/ListUrlBuilder.ts';
import type { SortDirection } from './models/SortDirection.ts';
import type { Sorting } from './models/Sorting.ts';

type UserListsSorting = {
  current: Observable<{
    sorting: Sorting<UserListsSortBy>;
    sortHow: SortDirection;
  }>;
  options: Sorting<UserListsSortBy>[];
  update: (params: Record<string, string>) => void;
  urlBuilder: ListUrlBuilder<UserListsSortBy>;
};

type UseUserListsSortingProps = {
  slug: string;
};

function mapToDirection(value: string | Nil): SortDirection | undefined {
  return value === 'asc' || value === 'desc' ? value : undefined;
}

function mapToSortBy(value: string | Nil): UserListsSortBy | undefined {
  const sortBy = userListsSortOptions.find((option) => option.value === value);
  return sortBy?.value;
}

function defaultDirection(sortBy: UserListsSortBy): SortDirection {
  return sortBy === 'rank' || sortBy === 'name' ? 'asc' : 'desc';
}

export function useUserListsSorting(
  props: UseUserListsSortingProps,
): UserListsSorting {
  const params = new BehaviorSubject<Record<string, string | null>>({
    sort_by: null,
    sort_how: null,
  });

  function update(newParams: Record<string, string>) {
    params.next({ ...newParams });
  }

  return {
    update,
    options: userListsSortOptions,
    current: params.pipe(
      map(($params) => {
        const sortBy = mapToSortBy($params.sort_by) ?? 'rank';
        const sortHow = mapToDirection($params.sort_how) ??
          defaultDirection(sortBy);
        const sorting = userListsSortOptions.find(
          (option) => option.value === sortBy,
        );

        return {
          sorting: assertDefined(sorting, 'Expected valid list sorting option'),
          sortHow,
        };
      }),
    ),
    urlBuilder: (
      { sortBy, sortHow }: ListUrlBuilderParams<UserListsSortBy>,
    ) =>
      UrlBuilder.lists.all(props.slug, 'personal', {
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(sortHow ? { sort_how: sortHow } : {}),
      }),
  };
}

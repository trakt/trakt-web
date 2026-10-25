import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import { useSortParams } from '$lib/sections/lists/stores/useSortParams.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { map, type Observable } from 'rxjs';
import { defaultDirection } from './defaultDirection.ts';
import { collaborationListsSortOptions } from './constants/collaborationListsSortOptions.ts';
import { userListsSortOptions } from './constants/userListsSortOptions.ts';
import type {
  ListUrlBuilder,
  ListUrlBuilderParams,
} from './models/ListUrlBuilder.ts';
import type { SortDirection } from './models/SortDirection.ts';
import type { Sorting } from './models/Sorting.ts';
import { toSortDirection } from './toSortDirection.ts';

type SortableListType = 'personal' | 'collaboration';

type UserListsSorting = {
  current: Observable<{
    sorting: Sorting<UserListsSortBy>;
    sortHow: SortDirection;
  }>;
  options: Sorting<UserListsSortBy>[];
  urlBuilder: ListUrlBuilder<UserListsSortBy>;
  directionFor: (sortBy: UserListsSortBy | Nil) => SortDirection;
};

type UseUserListsSortingProps = {
  slug: string;
  type?: SortableListType;
};

const SORTING_BY_TYPE: Record<
  SortableListType,
  {
    options: Sorting<UserListsSortBy>[];
    fallback: UserListsSortBy | undefined;
  }
> = {
  personal: { options: userListsSortOptions, fallback: 'rank' },
  collaboration: {
    options: collaborationListsSortOptions,
    fallback: undefined,
  },
};

export function useUserListsSorting({
  slug,
  type = 'personal',
}: UseUserListsSortingProps): UserListsSorting {
  const { options, fallback } = SORTING_BY_TYPE[type];

  return {
    options,
    directionFor: defaultDirection,
    current: useSortParams().pipe(
      map(($params) => {
        const match = options.find(
          (option) => option.value != null && option.value === $params.sortBy,
        );
        const sortBy = match?.value ?? fallback;
        const sortHow =
          toSortDirection($params.sortHow) ?? defaultDirection(sortBy);
        const sorting = options.find((option) => option.value === sortBy);

        return {
          sorting: assertDefined(sorting, 'Expected valid list sorting option'),
          sortHow,
        };
      }),
    ),
    urlBuilder: ({ sortBy, sortHow }: ListUrlBuilderParams<UserListsSortBy>) =>
      UrlBuilder.lists.all(slug, type, {
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(sortHow ? { sort_how: sortHow } : {}),
      }),
  };
}

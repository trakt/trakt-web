import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { upNextNitroQuery } from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import { upNextQuery } from '$lib/requests/queries/sync/upNextQuery.ts';
import type { UpNextType } from '$lib/sections/lists/progress/useUpNextExperiment.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

export type UpNextStoreProps = {
  type: UpNextType;
} & PaginationParams;

function typeToQuery(
  { type, limit, page }: UpNextStoreProps,
) {
  const { current: user } = useUser();
  const params = {
    limit,
    page,
    sort: user().preferences.progress.sort,
  };

  switch (type) {
    case 'standard':
      return upNextQuery(params);
    case 'nitro':
      return upNextNitroQuery(params);
  }
}

export function useUpNextList(
  props: UpNextStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}

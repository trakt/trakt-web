import { useOwnSharedLists } from '$lib/sections/lists/user/useOwnSharedLists.ts';
import { map } from 'rxjs';

export function useSharedListIds() {
  const { list, isLoading } = useOwnSharedLists('me');

  return {
    sharedListIds: list.pipe(
      map(($list) => new Set($list.map((sharedList) => sharedList.id))),
    ),
    isLoading,
  };
}

import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { map } from 'rxjs';
import { useSmartLists } from '../smart/useSmartLists.ts';
import type { MyListsEntry } from './models/MyListsEntry.ts';
import type { MyListsType } from './models/MyListsType.ts';
import { usePersonalListsSummary } from './usePersonalListsSummary.ts';

type UseMyListsParams = {
  type: MyListsType;
  slug: string;
  mode: DiscoverMode;
};

export function useMyLists({ type, slug, mode }: UseMyListsParams) {
  if (type === 'smart') {
    const { list, isLoading } = useSmartLists({ mode });

    return {
      isLoading,
      items: list.pipe(
        map(($list): MyListsEntry[] =>
          $list.map((entry) => ({
            key: entry.key,
            kind: 'smart',
            list: entry,
          })),
        ),
      ),
    };
  }

  const { list, isLoading } = usePersonalListsSummary({ type, slug });

  return {
    isLoading,
    items: list.pipe(
      map(($list): MyListsEntry[] =>
        $list.map((entry) => ({
          key: entry.key,
          kind: 'custom',
          list: entry,
        })),
      ),
    ),
  };
}

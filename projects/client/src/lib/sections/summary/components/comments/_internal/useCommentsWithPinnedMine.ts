import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import type { CommentTypeProps } from '$lib/sections/summary/components/comments/CommentsProps.ts';
import { useComments } from './useComments.ts';
import { useMyComments } from './useMyComments.ts';
import type { UseMyCommentsProps } from './UseMyCommentsProps.ts';

type UseCommentsWithPinnedMineProps = {
  slug: string;
  limit?: number;
  sort: CommentSortType;
  language?: string;
  pinMine$: Observable<boolean>;
  myCommentsParams$: Observable<UseMyCommentsProps>;
} & CommentTypeProps;

export function useCommentsWithPinnedMine(
  { pinMine$, myCommentsParams$, ...props }: UseCommentsWithPinnedMineProps,
) {
  const { list, isLoading, hasNextPage, fetchNextPage } = useComments(props);

  const pinnedParams$ = combineLatest([myCommentsParams$, pinMine$]).pipe(
    map(([params, pinMine]) => ({
      ...params,
      enabled: params.enabled && pinMine,
    })),
  );

  const { list: mineList, isLoading: isMineLoading } = useMyComments(
    pinnedParams$,
  );

  const pinnedList = combineLatest([list, mineList]).pipe(
    map(([comments, mine]) => {
      const latest = mine[0];

      if (latest == null) {
        return comments;
      }

      return [
        latest,
        ...comments.filter(({ key }) => key !== latest.key),
      ];
    }),
  );

  // Reflects both queries - otherwise a consumer reads isLoading: false
  // before the pinned entry has actually arrived, flashing the unpinned
  // list first. A disabled mine query reports not-loading.
  const combinedIsLoading = combineLatest([isLoading, isMineLoading]).pipe(
    map(([listLoading, mineLoading]) => listLoading || mineLoading),
  );

  return {
    list: pinnedList,
    isLoading: combinedIsLoading,
    hasNextPage,
    fetchNextPage,
  };
}

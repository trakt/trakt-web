import {
  type UserCommentEntry,
  userCommentsQuery,
} from '$lib/requests/queries/users/userCommentsQuery.ts';
import { map, type Observable } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

const pageLimit = 100;
const lookbackDays = 14;

export type CommentEntry = UserCommentEntry;

export function filterCommentEntries(
  entries: readonly CommentEntry[],
  now: Date,
): readonly CommentEntry[] {
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lookbackDays);
  return entries.filter((e) => e.createdAt >= cutoff);
}

export function useUserComments(slug: string): {
  comments: Observable<ReadonlyArray<CommentEntry>>;
  isLoadingComments: Observable<boolean>;
} {
  const now = new Date();

  const { list, isLoading } = usePaginatedListQuery(
    userCommentsQuery({ slug, limit: pageLimit }),
  );

  return {
    comments: list.pipe(
      map((entries) => filterCommentEntries(entries, now)),
    ),
    isLoadingComments: isLoading,
  };
}

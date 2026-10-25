import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import type { SortDirection } from '../models/SortDirection.ts';

type SortCollaborationListsParams = {
  owned: ReadonlyArray<MediaListSummary>;
  shared: ReadonlyArray<MediaListSummary>;
  sortBy: UserListsSortBy | Nil;
  sortHow: SortDirection;
};

type Comparator = (a: MediaListSummary, b: MediaListSummary) => number;

const byName: Comparator = (a, b) =>
  a.name.localeCompare(b.name, undefined, {
    sensitivity: 'base',
    numeric: true,
  });

const byUpdatedAt: Comparator = (a, b) =>
  a.updatedAt.getTime() - b.updatedAt.getTime();

const byCreatedAt: Comparator = (a, b) =>
  a.createdAt.getTime() - b.createdAt.getTime();

function toComparator(sortBy: UserListsSortBy | Nil): Comparator {
  switch (sortBy) {
    case 'name':
      return byName;
    case 'created_at':
      return byCreatedAt;
    default:
      return byUpdatedAt;
  }
}

function sortLists(
  lists: ReadonlyArray<MediaListSummary>,
  comparator: Comparator,
  sortHow: SortDirection,
) {
  return lists.toSorted((a, b) =>
    sortHow === 'asc' ? comparator(a, b) : comparator(b, a),
  );
}

function isDefaultSort(sortBy: UserListsSortBy | Nil) {
  return sortBy == null || sortBy === 'rank';
}

export function sortCollaborationLists({
  owned,
  shared,
  sortBy,
  sortHow,
}: SortCollaborationListsParams): MediaListSummary[] {
  const comparator = toComparator(sortBy);
  const sorted = isDefaultSort(sortBy)
    ? [
        ...sortLists(owned, comparator, sortHow),
        ...sortLists(shared, comparator, sortHow),
      ]
    : sortLists([...owned, ...shared], comparator, sortHow);

  return dedupe((list) => list.id, sorted);
}

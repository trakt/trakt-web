import { recentListsSubject } from './_internal/recentListsSubject.ts';

export function getRecentListIds(): ReadonlyArray<number> {
  return recentListsSubject.value;
}

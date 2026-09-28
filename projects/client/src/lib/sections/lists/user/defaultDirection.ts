import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { SortDirection } from './models/SortDirection.ts';

export function defaultDirection(sortBy: UserListsSortBy): SortDirection {
  return sortBy === 'rank' || sortBy === 'name' ? 'asc' : 'desc';
}

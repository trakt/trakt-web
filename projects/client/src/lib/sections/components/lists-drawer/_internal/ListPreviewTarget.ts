import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';

export type ListPreviewTarget =
  | { type: 'watchlist' }
  | { type: 'list'; list: UserList };

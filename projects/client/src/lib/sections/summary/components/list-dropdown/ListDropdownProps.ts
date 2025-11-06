import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';

export type ListDropdownProps = {
  size?: 'normal' | 'small';
  style?: 'normal' | 'action';
  title: string;
  lists: UserList[];
  media: MediaEntry;
  isLoadingLists?: boolean;
};

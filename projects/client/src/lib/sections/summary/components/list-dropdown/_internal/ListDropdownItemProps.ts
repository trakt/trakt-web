import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import type { ListId } from '$lib/requests/queries/users/userMovieListIdsQuery.ts';
import type { BehaviorSubject } from 'rxjs';
import type { ListDropdownItemIntl } from './ListDropdownItemIntl.ts';

export type ListDropdownItemProps = {
  title: string;
  list: UserList;
  isUpdating: BehaviorSubject<boolean>;
  i18n?: ListDropdownItemIntl;
  media: MediaEntry;
  listedOnIds: ListId[];
} & Omit<ButtonProps, 'children' | 'onclick' | 'label' | 'type' | 'value'>;

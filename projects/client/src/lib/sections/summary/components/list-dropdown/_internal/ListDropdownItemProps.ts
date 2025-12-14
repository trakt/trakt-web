import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import type { BehaviorSubject } from 'rxjs';
import type { ListDropdownItemIntl } from './ListDropdownItemIntl.ts';

export type ListDropdownItemProps = {
  list: UserList;
  media: {
    id: number;
    type: string;
  };
  isUpdating: BehaviorSubject<boolean>;
  title: string;
  listedOnIds: number[];
  i18n?: ListDropdownItemIntl;
};

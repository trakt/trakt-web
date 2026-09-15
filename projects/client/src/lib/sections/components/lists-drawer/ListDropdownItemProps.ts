import type { DropdownItemFlash } from '$lib/components/dropdown/DropdownItemFlash.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import type { ListDropdownItemIntl } from './ListDropdownItemIntl.ts';

export type ListDropdownItemProps = {
  list: UserList;
  media: {
    id: number;
    type: string;
  };
  onLoading?: (isLoading: boolean) => void;
  title: string;
  isListed: boolean;
  flash?: DropdownItemFlash | Nil;
  i18n?: ListDropdownItemIntl;
};

import * as m from '$lib/features/i18n/messages.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { Sorting } from '../models/Sorting.ts';
import { userListsSortOptions } from './userListsSortOptions.ts';

export const collaborationListsSortOptions: Sorting<UserListsSortBy>[] = [
  {
    value: undefined,
    text: m.button_text_sort_default,
    label: m.button_label_sort_default,
  },
  ...userListsSortOptions.filter((option) => option.value !== 'rank'),
];

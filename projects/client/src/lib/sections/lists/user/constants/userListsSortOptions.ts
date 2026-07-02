import * as m from '$lib/features/i18n/messages.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { Sorting } from '../models/Sorting.ts';

export const userListsSortOptions: Sorting<UserListsSortBy>[] = [
  {
    value: 'rank',
    text: m.button_text_sort_rank,
    label: m.button_label_sort_rank,
  },
  {
    value: 'name',
    text: m.button_text_sort_name,
    label: m.button_label_sort_name,
  },
  {
    value: 'updated_at',
    text: m.button_text_sort_updated_date,
    label: m.button_label_sort_updated_date,
  },
  {
    value: 'created_at',
    text: m.button_text_sort_created_date,
    label: m.button_label_sort_created_date,
  },
];

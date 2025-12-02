import * as m from '$lib/features/i18n/messages.ts';
import type { Sorting } from '../models/Sorting.ts';

export const LIST_SORT_OPTIONS: Sorting[] = [
  {
    value: undefined,
    text: m.button_text_sort_default,
    label: m.button_label_sort_default,
  },
  {
    value: 'added',
    text: m.button_text_sort_added_date,
    label: m.button_label_sort_added_date,
  },
  {
    value: 'runtime',
    text: m.button_text_sort_runtime,
    label: m.button_label_sort_runtime,
  },
  {
    value: 'percentage',
    text: m.button_text_sort_rating,
    label: m.button_label_sort_rating,
  },
  {
    value: 'released',
    text: m.button_text_sort_release_date,
    label: m.button_label_sort_release_date,
  },
] as const;

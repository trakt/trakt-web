import { m } from '$lib/features/i18n/messages.ts';
import type { ClearSourceType } from '../models/ClearSourceType.ts';

type ClearSource = {
  type: ClearSourceType;
  label: () => string;
};

export const CLEAR_DATA_SOURCES: readonly ClearSource[] = [
  {
    type: 'watchlist',
    label: m.text_clear_source_watchlist,
  },
  {
    type: 'ratings',
    label: m.text_clear_source_ratings,
  },
  {
    type: 'history',
    label: m.text_clear_source_history,
  },
  {
    type: 'library',
    label: m.text_clear_source_library,
  },
];

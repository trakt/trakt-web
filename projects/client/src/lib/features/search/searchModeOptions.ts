import type { SegmentedSelectOption } from '$lib/components/select/models/SegmentedSelectOption.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';

type SearchModeIntl = {
  value: SearchMode;
  text: () => string;
  label: () => string;
};

const SEARCH_MODES: ReadonlyArray<SearchModeIntl> = [
  {
    value: 'media',
    text: m.button_text_toggle_search_media,
    label: m.button_label_toggle_search_media,
  },
  {
    value: 'show',
    text: m.button_text_shows,
    label: m.button_label_toggle_search_shows,
  },
  {
    value: 'movie',
    text: m.button_text_movies,
    label: m.button_label_toggle_search_movies,
  },
  {
    value: 'people',
    text: m.button_text_toggle_search_people,
    label: m.button_label_toggle_search_people,
  },
  {
    value: 'lists',
    text: m.button_text_toggle_search_lists,
    label: m.button_label_toggle_search_lists,
  },
];

export function searchModeOptions(): SegmentedSelectOption<SearchMode>[] {
  return SEARCH_MODES.map(({ value, text, label }) => ({
    value,
    text: text(),
    label: label(),
  }));
}

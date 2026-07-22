import type { SegmentedSelectOption } from '$lib/components/select/models/SegmentedSelectOption.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';

const LABELS: ReadonlyArray<[SearchMode, () => string]> = [
  ['media', m.button_text_toggle_search_media],
  ['show', m.button_text_shows],
  ['movie', m.button_text_movies],
  ['people', m.button_text_toggle_search_people],
  ['lists', m.button_text_toggle_search_lists],
];

export function searchModeOptions(): SegmentedSelectOption<SearchMode>[] {
  return LABELS.map(([value, label]) => ({ value, label: label() }));
}

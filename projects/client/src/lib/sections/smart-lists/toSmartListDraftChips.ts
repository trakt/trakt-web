import * as m from '$lib/features/i18n/messages.ts';
import type { SmartListDraft } from '$lib/requests/models/SmartListDraft.ts';
import { getSmartListFilterLabels } from '$lib/sections/lists/smart/getSmartListFilterLabels.ts';

function toMediaTypeLabel(mediaType: SmartListDraft['mediaType']): string {
  switch (mediaType) {
    case 'movies':
      return m.button_text_movies();
    case 'shows':
      return m.button_text_shows();
    case 'media':
      return m.button_text_media();
  }
}

export function toSmartListDraftChips(draft: SmartListDraft): string[] {
  const [source, ...filters] = getSmartListFilterLabels(draft);

  return [source, toMediaTypeLabel(draft.mediaType), ...filters];
}

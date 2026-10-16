import * as m from '$lib/features/i18n/messages.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';

export function toSmartListMediaTypeLabel(
  mediaType: SmartListMediaType,
): string {
  switch (mediaType) {
    case 'movies':
      return m.button_text_movies();
    case 'shows':
      return m.button_text_shows();
    case 'media':
      return m.button_text_media();
  }
}

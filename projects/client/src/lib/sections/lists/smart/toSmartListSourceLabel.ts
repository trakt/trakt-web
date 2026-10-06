import * as m from '$lib/features/i18n/messages.ts';
import type { SmartListSource } from '$lib/requests/queries/users/smartListQuery.ts';

export function toSmartListSourceLabel(source: SmartListSource): string {
  switch (source) {
    case 'trending':
      return m.list_title_trending();
    case 'popular':
      return m.list_title_most_popular();
    case 'anticipated':
      return m.list_title_most_anticipated();
    case 'recommendations':
      return m.list_title_recommended();
    case 'discover':
      return m.button_label_discover();
    case 'watchlist':
      return m.list_title_watchlist();
    case 'library':
      return m.list_title_library();
  }
}

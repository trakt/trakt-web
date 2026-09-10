import * as m from '$lib/features/i18n/messages.ts';
import { ListTarget } from '../models/ListTarget.ts';

export function toTargetLabel(target: ListTarget): string {
  switch (target) {
    case ListTarget.Trending:
      return m.list_title_trending();
    case ListTarget.Anticipated:
      return m.list_title_most_anticipated();
    case ListTarget.Popular:
      return m.list_title_most_popular();
    case ListTarget.Recommendations:
      return m.list_title_recommended();
    case ListTarget.Watchlist:
      return m.list_title_watchlist();
    case ListTarget.Library:
      return m.list_title_library();
  }
}

import * as m from '$lib/features/i18n/messages.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import type { UsageCategoryItem } from './mapToUsageCategories.ts';

// FIXME: add notes & smart list limits when features are available
export function mapToUpsellLimits(limits: UserLimits): UsageCategoryItem[] {
  return [
    {
      title: m.limit_title_watch_history,
      limits: limits.history,
    },
    {
      title: m.limit_title_total_list_items,
      limits: limits.totalListItems,
    },
    {
      title: m.limit_title_watchlist_items,
      limits: limits.watchlistItems,
    },
    {
      title: m.limit_title_ratings,
      limits: limits.ratings,
    },
    {
      title: m.limit_title_personal_lists,
      limits: limits.staticLists,
    },
    {
      title: m.limit_title_digital_library,
      limits: limits.digitalLibrary,
    },
    {
      title: m.limit_title_offline_library,
      limits: limits.offlineLibrary,
    },
  ];
}

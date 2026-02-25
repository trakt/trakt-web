import * as m from '$lib/features/i18n/messages.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';

export type UsageCategoryItem = {
  title: () => string;
  limits: {
    current: number;
    free: number;
    vip: number;
  };
};

export type UsageCategory = {
  title: () => string;
  items: UsageCategoryItem[];
};

// FIXME: add notes & smart list limits when features are available
export function mapToUsageCategories(limits: UserLimits): UsageCategory[] {
  return [
    {
      title: m.usage_title_personal_activity,
      items: [
        {
          title: m.limit_title_watch_history,
          limits: limits.history,
        },
        {
          title: m.limit_title_ratings,
          limits: limits.ratings,
        },
      ],
    },
    {
      title: m.usage_title_lists,
      items: [
        {
          title: m.limit_title_personal_lists,
          limits: limits.staticLists,
        },
        {
          title: m.limit_title_total_list_items,
          limits: limits.totalListItems,
        },
        {
          title: m.limit_title_watchlist_items,
          limits: limits.watchlistItems,
        },
      ],
    },
    {
      title: m.usage_title_library,
      items: [
        {
          title: m.limit_title_digital_library,
          limits: limits.digitalLibrary,
        },
        {
          title: m.limit_title_offline_library,
          limits: limits.offlineLibrary,
        },
      ],
    },
  ];
}

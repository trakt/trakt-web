import * as m from '$lib/features/i18n/messages.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import { USER_LIMITS_PLACEHOLDER } from '$lib/sections/vip/_internal/constants/index.ts';

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

export function mapToUsageCategories(
  props: UserLimits | Nil,
): UsageCategory[] {
  const limits = props ?? USER_LIMITS_PLACEHOLDER;

  return [
    {
      title: m.usage_title_lists,
      items: [
        {
          title: m.limit_title_smart_lists,
          limits: limits.dynamicLists,
        },
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
      ],
    },
  ];
}

import type { UserLimitsResponseSchema } from '$lib/requests/queries/vip/userLimitsQuery.ts';
import type { z } from 'zod';

export const UserLimitsResponseMock: z.infer<typeof UserLimitsResponseSchema> =
  {
    history: { current: 1240, free: 1000, vip: 100000 },
    ratings: { current: 312, free: 1000, vip: 100000 },
    watchlist_items: { current: 48, free: 500, vip: 10000 },
    total_list_items: { current: 210, free: 1000, vip: 100000 },
    static_lists: { current: 2, free: 5, vip: 50 },
    dynamic_lists: { current: 1, free: 3, vip: 50 },
    digital_library: { current: 15, free: 50, vip: 10000 },
    total_notes: { current: 6, free: 100, vip: 10000 },
    connected_apps: { current: 1, free: 1, vip: 50 },
  };

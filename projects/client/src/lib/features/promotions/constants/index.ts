import type { PromotionConfig } from '../models/PromotionConfig.ts';

// Promotion times are in UTC
export const PROMOTIONS: Record<string, PromotionConfig> = {
  blackFriday: {
    id: 'black-friday',
    audience: 'free',
    start: { year: 2025, month: 10, day: 28, hour: 12, minute: 1, second: 0 },
    end: { year: 2025, month: 11, day: 1, hour: 23, minute: 59, second: 59 },
  },
};

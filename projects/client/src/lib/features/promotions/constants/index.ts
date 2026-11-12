import type { PromotionConfig } from '../models/PromotionConfig.ts';

// Promotion times are in UTC
// FIXME: extract logic from buildLocalDate and start months at 1
export const PROMOTIONS: Record<string, PromotionConfig> = {
  yir2025: {
    id: 'yir-2025',
    audience: 'free',
    start: { year: 2025, month: 11, day: 22, hour: 12, minute: 1, second: 0 },
    end: { year: 2026, month: 0, day: 31, hour: 23, minute: 59, second: 59 },
  },
};

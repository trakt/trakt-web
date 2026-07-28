import type { AnalyticsData } from '../AnalyticsData.ts';

export type AnalyticsEngine = {
  record: (key: string, data: AnalyticsData) => void;
};

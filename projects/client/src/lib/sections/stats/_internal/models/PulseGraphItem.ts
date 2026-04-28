import type { PeakHoursData } from './PeakHoursData.ts';
import type { ScreenTimeDailyData } from './ScreenTimeDailyData.ts';

export type PulseGraphItem =
  | {
    readonly type: 'graph';
    readonly key: string;
    readonly kind: 'peakHours';
    readonly data: PeakHoursData;
  }
  | {
    readonly type: 'graph';
    readonly key: string;
    readonly kind: 'screenTimeDaily';
    readonly data: ScreenTimeDailyData;
  };

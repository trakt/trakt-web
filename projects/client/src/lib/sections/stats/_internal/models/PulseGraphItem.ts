import type { PeakHoursData } from './PeakHoursData.ts';
import type { ScreenTimeDailyData } from './ScreenTimeDailyData.ts';

type PulseGraphItemBase = {
  readonly type: 'graph';
  readonly key: string;
  readonly isEmpty: boolean;
};

export type PulseGraphItem =
  | (PulseGraphItemBase & {
    readonly kind: 'peakHours';
    readonly data: PeakHoursData;
  })
  | (PulseGraphItemBase & {
    readonly kind: 'screenTimeDaily';
    readonly data: ScreenTimeDailyData;
  });

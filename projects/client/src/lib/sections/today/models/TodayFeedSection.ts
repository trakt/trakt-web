import type { TodayDayPart } from './TodayDayPart.ts';
import type { TodayPersonAction } from './TodayPersonAction.ts';

export type TodayFeedSection = Readonly<{
  key: string;
  part: TodayDayPart;
  day: Date;
  entries: ReadonlyArray<TodayPersonAction>;
}>;

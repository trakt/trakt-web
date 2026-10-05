import type { TodayDayKind } from '../models/TodayDayKind.ts';
import type { TodayRange } from '../models/TodayRange.ts';

type TodayMastheadDay = Readonly<{
  key: string;
  kind: TodayDayKind;
  date: Date;
}>;

export type TodayMastheadProps = {
  days: ReadonlyArray<TodayMastheadDay>;
  selectedDay: TodayMastheadDay | Nil;
  range: TodayRange;
  counts: Readonly<Record<string, number | null>> | Nil;
  summary: string | null;
  isLoading: boolean;
  onChange: (key: string) => void;
};

export type TodayDayStripDay = Readonly<{
  key: string;
  date: Date;
  isToday: boolean;
}>;

export type TodayDayStripProps = {
  days: ReadonlyArray<TodayDayStripDay>;
  value: string;
  counts: Readonly<Record<string, number | null>> | Nil;
  onChange: (key: string) => void;
};

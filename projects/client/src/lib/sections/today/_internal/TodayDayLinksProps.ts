export type TodayDayLink = Readonly<{
  value: string;
  label: string;
  count?: number | Nil;
}>;

export type TodayDayLinksProps = {
  options: ReadonlyArray<TodayDayLink>;
  value: string;
  onChange: (value: string) => void;
};

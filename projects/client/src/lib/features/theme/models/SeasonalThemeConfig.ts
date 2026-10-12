import type { DatePart } from '$lib/models/DatePart.ts';

export type SeasonalDate = Omit<DatePart, 'year'>;

export type SeasonalThemeConfig = {
  id: string;
  start: SeasonalDate;
  end: SeasonalDate;
  actionBarImage?: string;
};

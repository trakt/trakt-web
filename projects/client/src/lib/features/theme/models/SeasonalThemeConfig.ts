import type { DatePart } from '$lib/models/DatePart.ts';

export type SeasonalThemeConfig = {
  id: string;
  start: DatePart;
  end: DatePart;
  actionBarImage?: string;
};

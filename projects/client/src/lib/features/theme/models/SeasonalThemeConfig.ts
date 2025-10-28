import type { DatePart } from './DatePart.ts';

export type SeasonalThemeConfig = {
  id: string;
  start: DatePart;
  end: DatePart;
};

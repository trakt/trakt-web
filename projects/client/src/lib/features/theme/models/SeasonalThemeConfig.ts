import type { DatePart } from '$lib/models/DatePart.ts';
import type { SeasonalThemeId } from './SeasonalThemeId.ts';

export type SeasonalDate = Omit<DatePart, 'year'>;

export type SeasonalThemeConfig = {
  id: SeasonalThemeId;
  start: SeasonalDate;
  end: SeasonalDate;
  hasDiscoverFilters?: boolean;
};

import type { FilterOverrideParams } from '$lib/requests/models/FilterParams.ts';
import type { DatePart } from './DatePart.ts';

export type SeasonalThemeConfig = {
  id: string;
  start: DatePart;
  end: DatePart;
  actionBarImage?: string;
  filters?: Array<
    {
      id: string;
    } & FilterOverrideParams
  >;
};

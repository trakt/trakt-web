import type { DatePart } from '$lib/models/DatePart.ts';
import type { FilterOverrideParams } from '$lib/requests/models/FilterParams.ts';

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

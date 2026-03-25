import { m } from '../../i18n/messages.ts';
import type { FilterOption } from '../models/FilterOptions.ts';
import { COUNTRY_REGIONS, Region } from './countries.ts';

function toRegionLabel(region: Region): string {
  switch (region) {
    case Region.NorthAmerica:
      return m.option_text_north_america();
    case Region.Europe:
      return m.option_text_europe();
    case Region.Asia:
      return m.option_text_asia();
    case Region.MiddleEast:
      return m.option_text_middle_east();
    case Region.Oceania:
      return m.option_text_oceania();
    case Region.LatinAmerica:
      return m.option_text_latin_america();
    case Region.Africa:
      return m.option_text_africa();
  }
}

export function generateRegionOptions(): FilterOption[] {
  return Object.entries(COUNTRY_REGIONS).map(([region, codes]) => ({
    label: toRegionLabel(region as Region),
    value: region,
    mapper: () => codes.join(','),
  }));
}

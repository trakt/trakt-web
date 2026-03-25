import { m } from '../../i18n/messages.ts';
import type { FilterOption } from '../models/FilterOptions.ts';
import { COUNTRY_REGIONS, Region } from './countries.ts';

const regionLabels: Readonly<Record<Region, () => string>> = {
  [Region.NorthAmerica]: m.option_text_north_america,
  [Region.Europe]: m.option_text_europe,
  [Region.Asia]: m.option_text_asia,
  [Region.MiddleEast]: m.option_text_middle_east,
  [Region.Oceania]: m.option_text_oceania,
  [Region.LatinAmerica]: m.option_text_latin_america,
  [Region.Africa]: m.option_text_africa,
};

export function generateRegionOptions(): FilterOption[] {
  return Object.entries(COUNTRY_REGIONS).map(([region, codes]) => ({
    label: regionLabels[region as Region],
    value: region,
    mapper: () => codes.join(','),
  }));
}

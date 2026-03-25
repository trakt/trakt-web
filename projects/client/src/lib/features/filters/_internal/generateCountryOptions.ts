import { languageTag } from '$lib/features/i18n/index.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import type { FilterOption } from '../models/FilterOptions.ts';
import { COUNTRY_REGIONS } from './countries.ts';

const HISTORICAL_COUNTRY_NAMES: Readonly<Record<string, string>> = {
  su: 'Soviet Union',
  yu: 'Yugoslavia',
  xc: 'Czechoslovakia',
};

function getCountryLabel(code: string): string {
  return HISTORICAL_COUNTRY_NAMES[code] ?? toCountryName(code, languageTag());
}

export function generateCountryOptions(): FilterOption[] {
  const allCodes = Object.values(COUNTRY_REGIONS).flat();

  return allCodes
    .map((code) => ({ label: () => getCountryLabel(code), value: code }))
    .toSorted((a, b) => a.label().localeCompare(b.label(), languageTag()));
}

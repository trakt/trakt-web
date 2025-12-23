import { MOST_POPULAR_COUNTRY_CODES } from './constants/index.ts';
import type { NamedServiceOptions } from './models/NamedServiceOptions.ts';

function getPopularityIndex(source: string): number {
  const index = MOST_POPULAR_COUNTRY_CODES.indexOf(source);
  return index === -1 ? MOST_POPULAR_COUNTRY_CODES.length : index;
}

export function sortStreamingCountries(
  list: NamedServiceOptions[],
  preferredCountry: string,
) {
  return list.toSorted((a, b) => {
    if (a.country === preferredCountry) return -1;
    if (b.country === preferredCountry) return 1;

    const difference = getPopularityIndex(a.country) -
      getPopularityIndex(b.country);
    if (difference !== 0) return difference;

    return a.countryName.localeCompare(b.countryName);
  });
}

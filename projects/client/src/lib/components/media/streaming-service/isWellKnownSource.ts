import { WELL_KNOWN_SERVICES } from './_internal/constants/index.ts';

/**
 * Matches a watch-now source slug against a service's slug keys, treating each
 * key as a whole underscore-delimited segment. This lets channel variants such
 * as `paramount_plus_amazon` or `fandango_at_home` resolve to their base
 * service, while keeping unrelated slugs that merely share letters apart
 * (e.g. `complex` must not match `plex`).
 */
export function matchesServiceSlug(
  serviceKeys: ReadonlyArray<string>,
  source: string,
): boolean {
  if (!source) {
    return false;
  }

  return serviceKeys.some((key) => source === key);
}

export function isWellKnownSource(source: string): boolean {
  return Object.values(WELL_KNOWN_SERVICES).some((serviceKeys) =>
    matchesServiceSlug(serviceKeys, source)
  );
}

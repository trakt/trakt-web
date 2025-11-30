import { WELL_KNOWN_SERVICES } from './_internal/constants/index.ts';

export function isWellKnownSource(source: string): boolean {
  return Object.values(WELL_KNOWN_SERVICES).some((serviceKeys) =>
    serviceKeys.includes(source)
  );
}

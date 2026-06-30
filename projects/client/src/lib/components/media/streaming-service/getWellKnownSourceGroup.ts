import { WELL_KNOWN_SERVICES } from './_internal/constants/index.ts';
import { matchesServiceSlug } from './isWellKnownSource.ts';

export function getWellKnownSourceGroup(source: string): string | undefined {
  const group = Object.entries(WELL_KNOWN_SERVICES).find(([, sources]) =>
    matchesServiceSlug(sources, source)
  );

  if (!group) {
    return undefined;
  }

  const [key] = group;
  return key;
}

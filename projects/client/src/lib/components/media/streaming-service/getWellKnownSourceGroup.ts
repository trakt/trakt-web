import { WELL_KNOWN_SERVICES } from './_internal/constants/index.ts';

export function getWellKnownSourceGroup(source: string): string | undefined {
  return Object.entries(WELL_KNOWN_SERVICES).find(([, sources]) =>
    sources.includes(source)
  )?.at(0) as string | undefined;
}

import { WELL_KNOWN_SERVICES } from './_internal/constants/index.ts';

function containsSegments(
  sourceSegments: ReadonlyArray<string>,
  slugSegments: ReadonlyArray<string>,
): boolean {
  if (slugSegments.length === 0) {
    return false;
  }

  return sourceSegments.some((_, index) =>
    slugSegments.every((segment, offset) =>
      sourceSegments.at(index + offset) === segment
    )
  );
}

export function getWellKnownSourceGroup(source: string): string | undefined {
  if (!source) {
    return undefined;
  }

  const sourceSegments = source.split('_');

  const group = Object.entries(WELL_KNOWN_SERVICES).find(([, slugs]) =>
    slugs.some((slug) => containsSegments(sourceSegments, slug.split('_')))
  );

  if (!group) {
    return undefined;
  }

  const [key] = group;
  return key;
}

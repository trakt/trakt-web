const PATH_TYPES: ReadonlyArray<readonly [string, string]> = [
  ['/movies/', 'movie'],
  ['/shows/', 'show'],
  ['/people/', 'person'],
];

export function toReviewDrilldownType(href: string | Nil): string | undefined {
  if (!href) {
    return undefined;
  }

  const { pathname } = new URL(href, 'http://localhost');

  return PATH_TYPES.find(([prefix]) => pathname.startsWith(prefix))?.at(1);
}

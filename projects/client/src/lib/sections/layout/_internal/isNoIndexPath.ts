const NO_INDEX_PREFIXES: readonly string[] = ['/profile', '/users'];

const INDEXABLE_PATTERNS: readonly RegExp[] = [
  /^\/users\/[^/]+\/lists\/[^/]+$/,
];

export function isNoIndexPath(pathname: string): boolean {
  if (INDEXABLE_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return false;
  }

  return NO_INDEX_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

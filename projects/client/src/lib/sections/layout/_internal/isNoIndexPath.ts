const NO_INDEX_PREFIXES: readonly string[] = ['/profile', '/users'];

export function isNoIndexPath(pathname: string): boolean {
  return NO_INDEX_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

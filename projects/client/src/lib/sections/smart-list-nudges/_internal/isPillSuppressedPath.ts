const SUPPRESSED_PATHS = [
  /^\/users\/[^/]+\/lists\/?$/,
  /^\/users\/[^/]+\/lists\/view\/personal\/?$/,
  /^\/users\/[^/]+\/lists\/(?!view\/?$)[^/]+\/?$/,
];

export function isPillSuppressedPath(pathname: string): boolean {
  return SUPPRESSED_PATHS.some((path) => path.test(pathname));
}

export function profileSlug(pathname: string) {
  return pathname.match(/^\/profile\/([^/]+)/)?.at(1) ?? null;
}

export function prependHttps(
  url: string | undefined,
  placeholder?: string,
): string {
  if (!url) {
    return placeholder ?? '';
  }

  return url.startsWith('http') ? url : `https://${url}`;
}

import { toUrl } from '$lib/utils/url/toUrl.ts';

export function isValidCorsOrigin(value: string): boolean {
  // `new URL` accepts a wildcard hostname, so it needs rejecting separately.
  if (value.includes('*')) {
    return false;
  }

  const url = toUrl(value);
  if (!url) {
    return false;
  }

  const isHttp = url.protocol === 'http:' || url.protocol === 'https:';
  const isOriginOnly = url.pathname === '/' && !url.search && !url.hash;
  const hasCredentials = Boolean(url.username || url.password);

  return isHttp && isOriginOnly && !hasCredentials;
}

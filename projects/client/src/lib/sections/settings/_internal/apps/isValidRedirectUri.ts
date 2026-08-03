import { toUrl } from '$lib/utils/url/toUrl.ts';

const OOB_REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

export function isValidRedirectUri(value: string): boolean {
  if (value === OOB_REDIRECT_URI) {
    return true;
  }

  const url = toUrl(value);
  if (!url) {
    return false;
  }

  if (url.search || url.hash) {
    return false;
  }

  // Opaque URIs (javascript:, data:, blob:, view-source:) carry an inline
  // payload instead of an authority; real redirect targets always have one.
  return value.toLowerCase().startsWith(`${url.protocol}//`);
}

import { toUrl } from '$lib/utils/url/toUrl.ts';

/** The server matches stored origins against the browser's `Origin` header. */
export function toCanonicalOrigin(value: string): string {
  return toUrl(value)?.origin ?? value;
}

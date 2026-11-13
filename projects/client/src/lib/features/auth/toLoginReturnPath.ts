import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

const BASE_ORIGIN = 'https://trakt.invalid';
const RETURNABLE_PATHS = new Set([UrlBuilder.vip()]);

export function toLoginReturnPath(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/')) return null;

  const url = new URL(value, BASE_ORIGIN);

  if (url.origin !== BASE_ORIGIN) return null;
  if (!RETURNABLE_PATHS.has(url.pathname)) return null;

  return `${url.pathname}${url.search}`;
}

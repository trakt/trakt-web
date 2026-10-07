import { PREFETCH_SHARE_PARAM } from '../requests/shouldPrefetch.ts';

type ToShareUrlParams = {
  url: string;
  shareCode: string | Nil;
};

export function toShareUrl({ url, shareCode }: ToShareUrlParams): string {
  if (!url) return url;

  const value = shareCode ?? 'true';

  if (url.startsWith('https://')) {
    const shareUrl = new URL(url);
    shareUrl.searchParams.set(PREFETCH_SHARE_PARAM, value);
    return shareUrl.toString();
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${PREFETCH_SHARE_PARAM}=${
    encodeURIComponent(value)
  }`;
}

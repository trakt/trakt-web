import { isTraktUrl } from '$lib/utils/url/isTraktUrl.ts';

const HTTPS_PROTOCOL = 'https:';

const toAbsoluteUrl = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

export function toCheckoutReturnUrl(value: string | Nil): string | undefined {
  if (!value) return;

  const url = toAbsoluteUrl(value);
  if (!url) return;
  if (url.protocol !== HTTPS_PROTOCOL) return;
  if (!isTraktUrl(url.href)) return;

  return url.href;
}

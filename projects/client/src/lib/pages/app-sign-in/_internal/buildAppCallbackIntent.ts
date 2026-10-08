const ANDROID_PACKAGE = 'tv.trakt.trakt';

export function buildAppCallbackIntent(
  callbackUrl: URL,
  fallbackUrl: string,
): string | null {
  if (!callbackUrl.searchParams.get('code')) {
    return null;
  }

  const target =
    `${callbackUrl.host}${callbackUrl.pathname}${callbackUrl.search}`;
  const extras = [
    `scheme=${callbackUrl.protocol.replace(':', '')}`,
    `package=${ANDROID_PACKAGE}`,
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`,
  ].join(';');

  return `intent://${target}#Intent;${extras};end`;
}

const APP_CALLBACK = 'trakt://auth';

export function buildAppCallbackDeepLink(callbackUrl: URL): string | null {
  if (!callbackUrl.searchParams.get('code')) {
    return null;
  }

  return `${APP_CALLBACK}${callbackUrl.search}`;
}

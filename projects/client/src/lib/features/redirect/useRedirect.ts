import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { get } from 'svelte/store';

const PARAM_NAME = 'ref';
const AUTO_SIGNIN_REF = 'trakt-og-switch';
const PUBLIC_REDIRECT_REF = 'trakt-og-autoredirect';

function mapToAnalyticsEvent(ref: string | null) {
  if (ref === PUBLIC_REDIRECT_REF) {
    return AnalyticsEvent.PublicRedirect;
  }

  return AnalyticsEvent.EnterLite;
}

export function useRedirect() {
  const { isAuthorized, login } = useAuth();

  const ref = page.url.searchParams.get(PARAM_NAME);
  const isAutoSignin = ref === AUTO_SIGNIN_REF;
  const isPublicRedirect = ref === PUBLIC_REDIRECT_REF;

  const { track } = useTrack(mapToAnalyticsEvent(ref));

  const redirect = () => {
    track();

    if (isAutoSignin && !get(isAuthorized)) {
      login();
      return;
    }

    const url = new URL(page.url);
    url.searchParams.delete(PARAM_NAME);

    goto(url, {
      replaceState: true,
    });
  };

  return {
    isOgRedirect: browser && (isAutoSignin || isPublicRedirect),
    redirect,
  };
}

import { goto } from '$app/navigation';
import { page } from '$app/state';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { get } from 'svelte/store';

const PARAM_NAME = 'ref';
const AUTO_SIGNIN_REF = 'trakt-og-switch';

export function useAutoSignin() {
  const { isAuthorized, url: authUrl } = useAuth();
  const { track } = useTrack(AnalyticsEvent.EnterLite, {});

  const ref = page.url.searchParams.get(PARAM_NAME);
  const isAutoSignin = ref === AUTO_SIGNIN_REF;

  const redirect = () => {
    track();

    if (!get(isAuthorized)) {
      globalThis.window.location.assign(get(authUrl));
      return;
    }

    const url = new URL(page.url);
    url.searchParams.delete(PARAM_NAME);

    goto(url, {
      replaceState: true,
    });
  };

  return {
    isAutoSignin,
    redirect,
  };
}

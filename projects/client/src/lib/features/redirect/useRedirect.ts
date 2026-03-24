import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';

const PARAM_NAME = 'ref';

enum RedirectRef {
  AutoSignin = 'trakt-og-switch',
  PublicRedirect = 'trakt-og-autoredirect',
  NonVipRedirect = 'trakt-og-autoredirect-non-vip',
  NonVipPublicRedirect = 'trakt-og-autoredirect-non-vip-public',
}

function mapToAnalyticsEvent(ref: string | null) {
  if (
    ref === RedirectRef.PublicRedirect ||
    ref === RedirectRef.NonVipPublicRedirect
  ) {
    return AnalyticsEvent.PublicRedirect;
  }

  if (ref === RedirectRef.NonVipRedirect) {
    return AnalyticsEvent.NonVipRedirect;
  }

  return AnalyticsEvent.EnterLite;
}

export function useRedirect() {
  const { isAuthorized, login } = useAuth();

  const ref = page.url.searchParams.get(PARAM_NAME);
  const isValidRef = Object.values(RedirectRef).includes(ref as RedirectRef);

  const { track } = useTrack(mapToAnalyticsEvent(ref));

  const redirect = () => {
    track();

    const shouldAutoSignin = [
      RedirectRef.AutoSignin,
      RedirectRef.NonVipRedirect,
    ].includes(ref as RedirectRef);

    if (shouldAutoSignin && !isAuthorized.value) {
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
    isOgRedirect: browser && isValidRef,
    redirect,
  };
}

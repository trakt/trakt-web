import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';

type RedirectForAudienceParams = {
  audience: 'authenticated' | 'public';
  hasSession: boolean;
  search: string;
};

export function redirectForAudience({
  audience,
  hasSession,
  search,
}: RedirectForAudienceParams) {
  if (audience === 'authenticated' && !hasSession) {
    return redirect(307, `${UrlBuilder.landing()}${search}`);
  }

  if (audience === 'public' && hasSession) {
    return redirect(307, `${UrlBuilder.home()}${search}`);
  }
}

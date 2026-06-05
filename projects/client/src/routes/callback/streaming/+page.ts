import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '$types/callback/streaming/$types.d.ts';

// Params younify appends to the return url in single-provider mode.
const YC_STATUS_PARAM = 'yc_status';
const YC_SERVICE_PARAM = 'yc_serviceId';

function toConnection(status: string | null): string | undefined {
  if (status === 'connected' || status === 'success') {
    return 'connected';
  }
  if (status === 'cancelled') {
    return 'cancelled';
  }
  if (status) {
    return 'error';
  }
  return undefined;
}

/**
 * Younify returns the user here after a connect attempt. We normalise its
 * `yc_status` into a clean result param and redirect to the settings page,
 * which surfaces the outcome and kicks off any follow-up sync. Doing this in a
 * load keeps the redirect at the routing layer rather than racing in onMount.
 */
export const load: PageLoad = ({ url }) => {
  const connection = toConnection(url.searchParams.get(YC_STATUS_PARAM));
  const service = connection
    ? url.searchParams.get(YC_SERVICE_PARAM)
    : undefined;

  redirect(303, UrlBuilder.settings.streamingSync({ connection, service }));
};

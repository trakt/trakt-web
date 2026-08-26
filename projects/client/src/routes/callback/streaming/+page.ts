import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '$types/callback/streaming/$types.d.ts';

// Younify appends these to the return url in single-provider mode. The beta and
// release apps name both the service param and the statuses differently, so
// accept either until the beta app is retired.
const YC_STATUS_PARAM = 'yc_status';
const YC_SERVICE_PARAMS = ['yc_service_id', 'yc_serviceId'];

const YC_CONNECTIONS: Record<string, string> = {
  succeeded: 'connected',
  connected: 'connected',
  success: 'connected',
  canceled: 'cancelled',
  cancelled: 'cancelled',
};

function toConnection(status: string | null): string | undefined {
  if (!status) {
    return undefined;
  }

  return YC_CONNECTIONS[status] ?? 'error';
}

function toService(url: URL): string | null {
  return YC_SERVICE_PARAMS
    .map((param) => url.searchParams.get(param))
    .find((value) => value != null) ?? null;
}

/**
 * Younify returns the user here after a connect attempt. We normalise its
 * `yc_status` into a clean result param and redirect to the settings page,
 * which surfaces the outcome and kicks off any follow-up sync. Doing this in a
 * load keeps the redirect at the routing layer rather than racing in onMount.
 */
export const load: PageLoad = ({ url }) => {
  const connection = toConnection(url.searchParams.get(YC_STATUS_PARAM));
  const service = connection ? toService(url) : undefined;

  redirect(303, UrlBuilder.settings.streamingServices({ connection, service }));
};

import { api, type ApiParams } from '$lib/requests/api.ts';

type ConnectStreamingParams = {
  serviceId: string;
  returnUrl: string;
} & ApiParams;

/**
 * Mints a signed younify web-auth URL for the given streaming service.
 * Returns the URL to open, or null when the service is not connectable
 * on the user's plan (422) or the request is otherwise rejected (400).
 */
export function connectStreamingRequest(
  { fetch, serviceId, returnUrl }: ConnectStreamingParams,
): Promise<string | null> {
  return api({ fetch })
    .younify
    .connect({
      body: {
        service_id: serviceId,
        return_url: returnUrl,
      },
    })
    .then((response) => response.status === 200 ? response.body.url : null);
}

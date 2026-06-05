import { api, type ApiParams } from '$lib/requests/api.ts';

type DisconnectStreamingParams = {
  serviceId: string;
} & ApiParams;

/**
 * Unlinks a streaming service from the authenticated user.
 */
export function disconnectStreamingRequest(
  { fetch, serviceId }: DisconnectStreamingParams,
): Promise<boolean> {
  return api({ fetch })
    .younify
    .disconnect({
      params: { service_id: serviceId },
    })
    .then(({ status }) => status === 204);
}

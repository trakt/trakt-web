import { api, type ApiParams } from '$lib/requests/api.ts';

type RefreshStreamingParams = {
  serviceId: string;
  /** Forces a full re-sync of all data rather than an incremental one. */
  allData?: boolean;
} & ApiParams;

/**
 * Queues a re-sync of a connected streaming service. When `allData` is set,
 * forces a full re-sync of all historical data rather than an incremental one.
 */
export function refreshStreamingRequest({
  fetch,
  serviceId,
  allData = false,
}: RefreshStreamingParams): Promise<boolean> {
  const client = api({ fetch }).younify;

  const request = allData
    ? client.refreshAll({
        params: { service_id: serviceId, all_data: 'true' },
      })
    : client.refresh({
        params: { service_id: serviceId },
      });

  return request.then(({ status }) => status === 201);
}

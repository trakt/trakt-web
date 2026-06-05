import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';

export type ServiceInfo = {
  name: string;
  logoUrl?: string | null;
  color?: string | null;
};

type ToServiceInfoParams = {
  serviceId: string | null | undefined;
  connections: Map<string, StreamingConnection> | null | undefined;
  application?: string | null;
};

/**
 * Resolves a streaming service id to its display info using the connections
 * lookup, falling back to the application name or raw id when the service is
 * not (or no longer) connected.
 */
export function toServiceInfo(
  { serviceId, connections, application }: ToServiceInfoParams,
): ServiceInfo | undefined {
  if (!serviceId) {
    return undefined;
  }

  const connection = connections?.get(serviceId);
  return {
    name: connection?.name ?? application ?? serviceId,
    logoUrl: connection?.logoUrl,
    color: connection?.color,
  };
}

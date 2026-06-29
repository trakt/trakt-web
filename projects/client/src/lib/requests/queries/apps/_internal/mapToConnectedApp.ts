import type { ConnectedApp } from '$lib/requests/models/ConnectedApp.ts';
import type { ConnectedAppResponse } from './ConnectedAppResponse.ts';

export function mapToConnectedApp(
  response: ConnectedAppResponse,
): ConnectedApp {
  return {
    id: response.id,
    key: `connected-app-${response.id}`,
    name: response.name,
    isApproved: response.approved,
    scopes: response.scopes,
    connectedAt: new Date(response.connected_at),
    lastUsedAt: new Date(response.last_used_at),
  };
}

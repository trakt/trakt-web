import type { OfflineActionEndpoint } from './models/OfflineActionEndpoint.ts';

export function isAddEndpoint(endpoint: OfflineActionEndpoint): boolean {
  return endpoint.endsWith(':add');
}

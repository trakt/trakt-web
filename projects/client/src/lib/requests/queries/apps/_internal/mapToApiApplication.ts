import type { ApiApplication } from '$lib/requests/models/ApiApplication.ts';
import type { ApiApplicationResponse } from './ApiApplicationResponse.ts';

export function mapToApiApplication(
  response: ApiApplicationResponse,
): ApiApplication {
  return {
    id: response.id,
    key: `api-application-${response.id}`,
    name: response.name,
    description: response.description,
    clientId: response.client_id,
    clientSecret: response.client_secret,
    redirectUris: response.redirect_uri.split('\n').map((line) => line.trim())
      .filter(Boolean),
    origins: response.origins,
    isApproved: response.approved,
    approvedAt: response.approved_at ? new Date(response.approved_at) : null,
    scopes: response.scopes,
    permissions: {
      canScrobble: response.permissions.scrobble ?? false,
      canCheckin: response.permissions.checkin ?? false,
      canCreateAccounts: response.permissions.account_create ?? false,
    },
    createdAt: new Date(response.created_at),
  };
}

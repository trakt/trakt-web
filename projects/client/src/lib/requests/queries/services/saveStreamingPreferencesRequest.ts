import type { ApiParams } from '$lib/requests/api.ts';
import { saveSettingsRequest } from '$lib/requests/queries/users/saveSettingsRequest.ts';

type SaveStreamingPreferencesParams = {
  country?: string;
  favorites?: string[];
} & ApiParams;

/**
 * Persists the user's watch-now streaming preferences - the default streaming
 * country and/or the list of favorite services - via the settings endpoint.
 * Only the provided fields are sent, leaving the rest untouched.
 */
export function saveStreamingPreferencesRequest(
  { fetch, country, favorites }: SaveStreamingPreferencesParams,
): Promise<boolean> {
  return saveSettingsRequest({
    fetch,
    body: {
      browsing: {
        watchnow: {
          ...(country !== undefined ? { country } : {}),
          ...(favorites !== undefined ? { favorites } : {}),
        },
      },
    },
  });
}

import { addRatingRequest } from '$lib/requests/sync/addRatingRequest.ts';
import { addToFavoritesRequest } from '$lib/requests/sync/addToFavoritesRequest.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeFromFavoritesRequest } from '$lib/requests/sync/removeFromFavoritesRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { removeRatingRequest } from '$lib/requests/sync/removeRatingRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import type { OfflineAction } from '../models/OfflineAction.ts';
import type { OfflineActionBody } from '../models/OfflineActionBody.ts';
import type { OfflineActionEndpoint } from '../models/OfflineActionEndpoint.ts';

type OfflineActionExecutors = {
  [TEndpoint in OfflineActionEndpoint]: (
    body: OfflineActionBody[TEndpoint],
  ) => Promise<boolean>;
};

const EXECUTORS: OfflineActionExecutors = {
  'history:add': (body) => markAsWatchedRequest({ body }),
  'history:remove': (body) => removeWatchedRequest({ body }),
  'watchlist:add': (body) => addToWatchlistRequest({ body }),
  'watchlist:remove': (body) => removeFromWatchlistRequest({ body }),
  'rating:add': (body) => addRatingRequest({ body }),
  'rating:remove': (body) => removeRatingRequest({ body }),
  'favorites:add': (body) => addToFavoritesRequest({ body }),
  'favorites:remove': (body) => removeFromFavoritesRequest({ body }),
};

export function executeOfflineAction(action: OfflineAction): Promise<boolean> {
  // Body typing is enforced at enqueue time (executeOrEnqueue); after an IDB
  // round-trip it is `unknown`, so the executor takes it back on trust.
  const execute = EXECUTORS[action.endpoint] as (
    body: unknown,
  ) => Promise<boolean>;
  return execute(action.body);
}

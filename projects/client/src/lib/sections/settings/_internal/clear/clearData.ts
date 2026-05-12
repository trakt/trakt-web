import { clearRatings } from '$lib/sections/settings/sync/clearRatings.ts';
import { clearWatchlist } from '$lib/sections/settings/sync/clearWatchlist.ts';
import type { SyncEngineCallbacks } from '../../sync/models/SyncEngineCallbacks.ts';
import type { ClearDataInput } from './models/ClearDataInput.ts';

export async function clearData(
  input: ClearDataInput,
  callbacks: SyncEngineCallbacks,
): Promise<void> {
  if (input.type === 'watchlist') {
    await clearWatchlist(input.input, callbacks);
  }

  if (input.type === 'ratings') {
    await clearRatings(input.input, callbacks);
  }
}

import { clearHistory } from '$lib/sections/settings/sync/clearHistory.ts';
import { clearRatings } from '$lib/sections/settings/sync/clearRatings.ts';
import { clearWatchlist } from '$lib/sections/settings/sync/clearWatchlist.ts';
import type { SyncEngineCallbacks } from '../../sync/models/SyncEngineCallbacks.ts';
import type { ClearDataInput } from './models/ClearDataInput.ts';

export async function clearData(
  data: ClearDataInput,
  callbacks: SyncEngineCallbacks,
): Promise<void> {
  if (data.type === 'watchlist') {
    await clearWatchlist(data.input, callbacks);
  }

  if (data.type === 'ratings') {
    await clearRatings(data.input, callbacks);
  }

  if (data.type === 'history') {
    await clearHistory(data.input, callbacks);
  }
}

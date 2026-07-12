import type { OfflineAction } from '$lib/features/offline/models/OfflineAction.ts';

export function buildOfflineAction(
  overrides: Partial<OfflineAction> = {},
): OfflineAction {
  return {
    id: crypto.randomUUID(),
    endpoint: 'history:add',
    keys: ['movie:1'],
    body: { movies: [{ ids: { trakt: 1 } }] },
    invalidations: ['invalidate:mark_as_watched:movie'],
    queuedAt: 1,
    ...overrides,
  };
}

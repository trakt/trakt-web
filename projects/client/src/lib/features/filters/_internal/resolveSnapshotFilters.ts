import { browser } from '$app/environment';

type ResolveSnapshotFiltersParams = {
  url: URL;
  isHistoryNavigation: boolean;
  takeSnapshot: (searchParams: URLSearchParams) => Record<string, string>;
};

const snapshotsByPath = new Map<string, Record<string, string>>();

export function resolveSnapshotFilters({
  url,
  isHistoryNavigation,
  takeSnapshot,
}: ResolveSnapshotFiltersParams): Record<string, string> {
  if (!browser) return takeSnapshot(url.searchParams);

  const stored = snapshotsByPath.get(url.pathname);
  if (isHistoryNavigation && stored) return stored;

  const snapshot = takeSnapshot(url.searchParams);
  snapshotsByPath.set(url.pathname, snapshot);
  return snapshot;
}

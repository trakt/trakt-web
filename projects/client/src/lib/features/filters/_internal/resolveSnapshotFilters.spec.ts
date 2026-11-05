import { describe, expect, it } from 'vitest';
import { resolveSnapshotFilters } from './resolveSnapshotFilters.ts';

const at = (path: string) => new URL(`http://localhost${path}`);

const takeSnapshot = (searchParams: URLSearchParams) =>
  Object.fromEntries(searchParams.entries());

describe('util: resolveSnapshotFilters', () => {
  it('should snapshot the filters from the url', () => {
    const result = resolveSnapshotFilters({
      url: at('/lists/a?genres=drama'),
      isHistoryNavigation: false,
      takeSnapshot,
    });

    expect(result).toEqual({ genres: 'drama' });
  });

  it('should restore the earlier snapshot on history navigation', () => {
    resolveSnapshotFilters({
      url: at('/lists/b?genres=drama'),
      isHistoryNavigation: false,
      takeSnapshot,
    });

    const result = resolveSnapshotFilters({
      url: at('/lists/b?genres=drama,comedy&ignore_watched=true'),
      isHistoryNavigation: true,
      takeSnapshot,
    });

    expect(result).toEqual({ genres: 'drama' });
  });

  it('should take a fresh snapshot on regular navigation', () => {
    resolveSnapshotFilters({
      url: at('/lists/c?genres=drama'),
      isHistoryNavigation: false,
      takeSnapshot,
    });

    const result = resolveSnapshotFilters({
      url: at('/lists/c?genres=comedy'),
      isHistoryNavigation: false,
      takeSnapshot,
    });

    expect(result).toEqual({ genres: 'comedy' });
  });

  it('should snapshot the url on history navigation without an earlier visit', () => {
    const result = resolveSnapshotFilters({
      url: at('/lists/d?genres=drama'),
      isHistoryNavigation: true,
      takeSnapshot,
    });

    expect(result).toEqual({ genres: 'drama' });
  });
});

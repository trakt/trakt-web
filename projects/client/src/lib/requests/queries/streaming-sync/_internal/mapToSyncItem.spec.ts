import { SyncPausedItemsResponseMock } from '$mocks/data/streaming-sync/response/SyncPausedItemsResponseMock.ts';
import { SyncSkippedItemsResponseMock } from '$mocks/data/streaming-sync/response/SyncSkippedItemsResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToSyncItem } from './mapToSyncItem.ts';

describe('util: mapToSyncItem', () => {
  describe('skipped items', () => {
    it('should leave type and trakt reference empty when unresolved', () => {
      const result = mapToSyncItem(SyncSkippedItemsResponseMock[0]!, 0);

      expect(result.type).to.equal(null);
      expect(result.traktItem).to.equal(undefined);
      expect(result.progress).to.equal(0);
      expect(result.watchedAt).to.deep.equal(
        new Date('2011-12-05T23:09:00.000Z'),
      );
    });

    it('should resolve a movie trakt reference with a url', () => {
      const result = mapToSyncItem(SyncSkippedItemsResponseMock[1]!, 1);

      expect(result.type).to.equal('movie');
      expect(result.traktItem).to.deep.equal({
        label: 'Air Force One (1997)',
        url: '/movies/air-force-one-1997',
      });
    });
  });

  describe('paused items', () => {
    it('should resolve an episode reference with show title and code', () => {
      const result = mapToSyncItem(SyncPausedItemsResponseMock[0]!, 0);

      expect(result.kind).to.equal('history');
      expect(result.type).to.equal('episode');
      expect(result.progress).to.equal(42.5);
      expect(result.traktItem?.label).to.equal(
        'The Last of Us S01E03: The Pollard Incident',
      );
      expect(result.traktItem?.url).to.equal(
        '/shows/the-last-of-us?view=episode&season=1&episode=3',
      );
    });
  });
});

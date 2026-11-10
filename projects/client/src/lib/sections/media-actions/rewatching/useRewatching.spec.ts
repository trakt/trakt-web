import { FEATURE_FLAG_LOCAL_STORAGE_KEY } from '$lib/features/feature-flag/FeatureFlagLocalStorageKey.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRewatching } from './useRewatching.ts';

const NOW = new Date('2026-01-01T12:00:00.000Z');
const SHOW_ID = 180770;
const RESET_URL = 'http://localhost/shows/:id/progress/watched/reset';

function setRewatchingFlag(isEnabled: boolean) {
  globalThis.localStorage.setItem(
    FEATURE_FLAG_LOCAL_STORAGE_KEY,
    JSON.stringify({ [FeatureFlag.Rewatching]: isEnabled }),
  );
}

describe('store: useRewatching', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  afterEach(() => {
    globalThis.localStorage.removeItem(FEATURE_FLAG_LOCAL_STORAGE_KEY);
  });

  describe('when the feature is enabled', () => {
    beforeEach(() => {
      setRewatchingFlag(true);
    });

    it('should start rewatching by resetting the watched progress', async () => {
      const { startRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      const requests = await captureRequests(startRewatching);

      expect(requests).to.deep.equal([
        `POST /shows/${SHOW_ID}/progress/watched/reset`,
      ]);
    });

    it('should send a reset time three minutes in the past', async () => {
      const bodies: { reset_at: string }[] = [];
      server.use(
        http.post(RESET_URL, async ({ request }) => {
          bodies.push((await request.json()) as { reset_at: string });
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const { startRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(NOW);
      try {
        await startRewatching();
      } finally {
        vi.useRealTimers();
      }

      expect(bodies.at(0)?.reset_at).to.equal('2026-01-01T11:57:00.000Z');
    });

    it('should stop rewatching by deleting the reset', async () => {
      const { stopRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      const requests = await captureRequests(stopRewatching);

      expect(requests).to.deep.equal([
        `DELETE /shows/${SHOW_ID}/progress/watched/reset`,
      ]);
    });

    it('should invalidate rewatching and watched state after starting', async () => {
      const { startRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      const invalidations = await captureInvalidations(startRewatching);

      expect(invalidations).toContain(InvalidateAction.Rewatching('show'));
      expect(invalidations).toContain(InvalidateAction.MarkAsWatched('show'));
    });

    it('should not invalidate anything when the request is rejected', async () => {
      server.use(
        http.post(RESET_URL, () => new HttpResponse(null, { status: 500 })),
      );
      const { startRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      const invalidations = await captureInvalidations(() =>
        startRewatching().catch(() => false),
      );

      expect(invalidations).not.toContain(InvalidateAction.Rewatching('show'));
    });
  });

  describe('when the feature is disabled', () => {
    beforeEach(() => {
      setRewatchingFlag(false);
    });

    it('should not start rewatching', async () => {
      const { startRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      let result: boolean | undefined;
      const requests = await captureRequests(async () => {
        result = await startRewatching();
      });

      expect(result).to.equal(false);
      expect(requests).to.deep.equal([]);
    });

    it('should not stop rewatching', async () => {
      const { stopRewatching } = await renderStore(() =>
        useRewatching({ show: { id: SHOW_ID } }),
      );

      let result: boolean | undefined;
      const requests = await captureRequests(async () => {
        result = await stopRewatching();
      });

      expect(result).to.equal(false);
      expect(requests).to.deep.equal([]);
    });
  });
});

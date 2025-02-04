import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import {
  type MarkAsWatchedStoreProps,
  useMarkAsWatched,
} from './useMarkAsWatched';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useMarkAsWatched', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    invalidate.mockReset();

    (useInvalidator as Mock).mockReturnValueOnce({
      invalidate,
    });
  });

  const runCommonTests = (
    props: MarkAsWatchedStoreProps,
    invalidation: string,
  ) => {
    it('should NOT be marking as watched when first requested', async () => {
      const { isMarkingAsWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      expect(get(isMarkingAsWatched)).toBe(false);
    });

    it('should be marking as watched when adding', async () => {
      const { isMarkingAsWatched, markAsWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      markAsWatched();
      expect(await waitForEmission(isMarkingAsWatched, 2)).toBe(true);
    });

    it('should NOT be marking as watched after add request is completed', async () => {
      const { isMarkingAsWatched, markAsWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      await markAsWatched();
      expect(get(isMarkingAsWatched)).toBe(false);
    });

    it('should be marking as watched when removing', async () => {
      const { isMarkingAsWatched, removeWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      removeWatched();
      expect(get(isMarkingAsWatched)).toBe(true);
    });

    it('should NOT be marking as watched after remove request is completed', async () => {
      const { isMarkingAsWatched, removeWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      await removeWatched();
      expect(get(isMarkingAsWatched)).toBe(false);
    });

    it('should call invalidate after marking as watched', async () => {
      const { removeWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      await removeWatched();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
    });

    it('should call invalidate after removing watched', async () => {
      const { removeWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      await removeWatched();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
    });

    it('should NOT be watched', async () => {
      const { isWatched } = await renderStore(() => useMarkAsWatched(props));

      expect(await waitForEmission(isWatched, 2)).toBe(false);
    });
  };

  describe('media type: movie', () => {
    const props = {
      type: 'movie' as const,
      media: { id: 1, airDate: new Date() },
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('movie'));

    it('should know Heretic is watched', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({ ...props, media: MovieHereticMappedMock })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(true);
    });
  });

  describe('media type: show', () => {
    const props = {
      type: 'show' as const,
      media: { id: 1, airDate: new Date() },
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('show'));

    it('should NOT be watched if it is Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({ ...props, media: ShowSiloMappedMock })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(false);
    });

    it('should be watched if it is Devs', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({ ...props, media: ShowDevsMappedMock })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(true);
    });
  });

  describe('media type: episode', () => {
    const props = {
      type: 'episode' as const,
      media: { id: 1, airDate: new Date() },
      episode: { season: 1, number: 1 },
      show: { id: 3 },
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('episode'));

    it('should be watched if it is episode 1 of season 1 of Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: { id: 1, airDate: new Date() },
          show: ShowSiloMappedMock,
          episode: { season: 1, number: 1 },
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(true);
    });

    it('should NOT be watched if it is episode 1, 2, 3, 4 & 5 of season 1 of Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: { id: 1, airDate: new Date() },
          show: ShowSiloMappedMock,
          episode: [
            { season: 1, number: 1 },
            { season: 1, number: 2 },
            { season: 1, number: 3 },
            { season: 1, number: 4 },
            { season: 1, number: 5 },
          ],
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(false);
    });

    it('should NOT be watched if it is episode 2 of season 1 of Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: { id: 1, airDate: new Date() },
          show: ShowSiloMappedMock,
          episode: { season: 1, number: 2 },
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(false);
    });

    it('should be watched for all episodes of Devs', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: ShowDevsMappedMock,
          show: ShowDevsMappedMock,
          episode: [
            { season: 1, number: 1 },
            { season: 1, number: 2 },
            { season: 1, number: 3 },
            { season: 1, number: 4 },
            { season: 1, number: 5 },
            { season: 1, number: 6 },
            { season: 1, number: 7 },
            { season: 1, number: 8 },
          ],
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(true);
    });
  });
});

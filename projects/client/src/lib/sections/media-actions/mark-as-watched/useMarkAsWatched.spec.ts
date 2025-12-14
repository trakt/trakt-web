import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import {
  type MarkAsWatchedStoreProps,
  useMarkAsWatched,
} from './useMarkAsWatched.ts';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useMarkAsWatched', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate }) // 1: useMarkAsWatched
      .mockReturnValueOnce({ invalidate }) // 2: useMarkAsWatched -> useUser
      .mockReturnValueOnce({ invalidate }) // 3: useMarkAsWatched -> useTrack -> useUser
      .mockReturnValueOnce({ invalidate }); // 4: useMarkAsWatched -> useIsWatched -> useUser
  });

  const runCommonTests = (
    props: MarkAsWatchedStoreProps,
    invalidation: string,
  ) => {
    it('should NOT be marking as watched when first requested', async () => {
      const { isMarkingAsWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      expect(await firstValueFrom(isMarkingAsWatched)).toBe(false);
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
      expect(await firstValueFrom(isMarkingAsWatched)).toBe(false);
    });

    it('should be marking as watched when removing', async () => {
      const { isMarkingAsWatched, removeWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      removeWatched();
      expect(await firstValueFrom(isMarkingAsWatched)).toBe(true);
    });

    it('should NOT be marking as watched after remove request is completed', async () => {
      const { isMarkingAsWatched, removeWatched } = await renderStore(() =>
        useMarkAsWatched(props)
      );

      await removeWatched();
      expect(await firstValueFrom(isMarkingAsWatched)).toBe(false);
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
      media: { id: 1, season: 1, number: 1, airDate: new Date() },
      show: { id: 3, title: 'show' },
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('episode'));

    it('should be watched if it is episode 1 of season 1 of Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: { id: 1, season: 1, number: 1, airDate: new Date() },
          show: ShowSiloMappedMock,
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(true);
    });

    it('should NOT be watched if it is episode 1, 2, 3, 4 & 5 of season 1 of Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: [
            { id: 1, season: 1, number: 1, airDate: new Date() },
            { id: 2, season: 1, number: 2, airDate: new Date() },
            { id: 3, season: 1, number: 3, airDate: new Date() },
            { id: 4, season: 1, number: 4, airDate: new Date() },
            { id: 5, season: 1, number: 5, airDate: new Date() },
          ],
          show: ShowSiloMappedMock,
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(false);
    });

    it('should NOT be watched if it is episode 2 of season 1 of Silo', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: { id: 1, season: 1, number: 2, airDate: new Date() },
          show: ShowSiloMappedMock,
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(false);
    });

    it('should be watched for all episodes of Devs', async () => {
      const { isWatched } = await renderStore(() =>
        useMarkAsWatched({
          ...props,
          media: [
            { id: 1, season: 1, number: 1, airDate: new Date() },
            { id: 2, season: 1, number: 2, airDate: new Date() },
            { id: 3, season: 1, number: 3, airDate: new Date() },
            { id: 4, season: 1, number: 4, airDate: new Date() },
            { id: 5, season: 1, number: 5, airDate: new Date() },
            { id: 6, season: 1, number: 6, airDate: new Date() },
            { id: 7, season: 1, number: 7, airDate: new Date() },
            { id: 8, season: 1, number: 8, airDate: new Date() },
          ],
          show: ShowDevsMappedMock,
        })
      );

      expect(await waitForEmission(isWatched, 2)).toBe(true);
    });
  });
});

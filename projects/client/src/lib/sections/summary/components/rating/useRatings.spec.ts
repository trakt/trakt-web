import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRatings } from './useRatings.ts';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useRatings', () => {
  const invalidate = vi.fn(function () {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate }) // 1: in useRatings
      .mockReturnValueOnce({ invalidate }) // 2: in useRatings -> useUser
      .mockReturnValueOnce({ invalidate }); // 3: in useRatings -> useTrack -> useUser
  });

  it('should indicate while rating is in progress', async () => {
    const { pendingRating, addRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    addRating(2);
    expect(await firstValueFrom(pendingRating)).toBe(2);
  });

  it('should not indicate that rating is in progress', async () => {
    const { pendingRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    expect(await firstValueFrom(pendingRating)).toBe(null);
  });

  it('should return the current rating', async () => {
    const { current } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    const value = await waitForValue(current, {
      rating: 10,
      isFavorited: false,
    });
    expect(value?.rating).toBe(10);
  });

  it('should return the current season rating', async () => {
    const season = assertDefined(ShowSiloSeasonsMappedMock.at(0));

    const { current } = await renderStore(() =>
      useRatings({
        type: 'season',
        id: season.id,
      })
    );

    const value = await waitForValue(current, {
      rating: 8,
      isFavorited: false,
    });
    expect(value?.rating).toBe(8);
  });

  it('should return undefined if there is no current rating', async () => {
    const { current } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      })
    );

    const value = await waitForEmission(current, 2);
    expect(value).toBeUndefined();
  });

  it('should call invalidate after rating', async () => {
    const { addRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      })
    );

    vi.useFakeTimers();
    addRating(2);
    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(invalidate)
      .toHaveBeenCalledWith(InvalidateAction.Rated('movie'));
    expect(invalidate)
      .not.toHaveBeenNthCalledWith(2, InvalidateAction.Favorited('movie'));
  });

  it('should call invalidate after rating a season', async () => {
    const season = assertDefined(ShowSiloSeasonsMappedMock.at(1));

    const { addRating } = await renderStore(() =>
      useRatings({
        type: 'season',
        id: season.id,
      })
    );

    vi.useFakeTimers();
    addRating(6);
    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(invalidate)
      .toHaveBeenCalledWith(InvalidateAction.Rated('season'));
  });
});

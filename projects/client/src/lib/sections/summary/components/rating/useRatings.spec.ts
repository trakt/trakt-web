import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRatings } from './useRatings.ts';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useRatings', () => {
  const invalidate = vi.fn(() => {});

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

    await addRating(2);
    expect(invalidate)
      .toHaveBeenCalledWith(InvalidateAction.Rated('movie'));
    expect(invalidate)
      .not.toHaveBeenNthCalledWith(2, InvalidateAction.Favorited('movie'));
  });
});

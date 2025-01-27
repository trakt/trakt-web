import { SimpleRating } from '$lib/models/SimpleRating';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction';
import { useInvalidator } from '$lib/stores/useInvalidator';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock';
import { renderStore } from '$test/beds/store/renderStore';
import { waitForEmission } from '$test/readable/waitForEmission';
import { waitForValue } from '$test/readable/waitForValue';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRatings } from './useRatings';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useRatings', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    invalidate.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate })
      .mockReturnValueOnce({ invalidate });
  });

  it('should indicate while rating is in progress', async () => {
    const { isRating, addRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    addRating(SimpleRating.Bad);
    expect(get(isRating)).toBe(true);
  });

  it('should not indicate that rating is in progress', async () => {
    const { isRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    expect(get(isRating)).toBe(false);
  });

  it('should return the current rating', async () => {
    const { currentRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    const rating = await waitForValue(currentRating, SimpleRating.Great);
    expect(rating).toBe('great');
  });

  it('should return undefined if there is no current rating', async () => {
    const { currentRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      })
    );

    const rating = await waitForEmission(currentRating, 2);
    expect(rating).toBeUndefined();
  });

  it('should return if the current item is favorited', async () => {
    const { isFavorited } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    expect(await waitForEmission(isFavorited, 2)).toBe(true);
  });

  it('should return undefined if the current item is not favorited', async () => {
    const { isFavorited } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      })
    );

    expect(await waitForEmission(isFavorited, 2)).toBe(false);
  });

  it('should call invalidate after rating', async () => {
    const { addRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      })
    );

    await addRating(SimpleRating.Bad);
    expect(invalidate)
      .toHaveBeenCalledWith(InvalidateAction.Rated('movie'));
    expect(invalidate)
      .not.toHaveBeenNthCalledWith(2, InvalidateAction.Favorited('movie'));
  });

  it('should also invalidate favorite after rating a favorited item to a lower rating', async () => {
    const { addRating, isFavorited } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      })
    );

    await waitForEmission(isFavorited, 2);
    await addRating(SimpleRating.Bad, get(isFavorited));

    expect(invalidate)
      .toHaveBeenCalledWith(InvalidateAction.Rated('movie'));
    expect(invalidate)
      .toHaveBeenNthCalledWith(2, InvalidateAction.Favorited('movie'));
  });

  it('should also invalidate favorite after rating a non-favorited item with the highest rating', async () => {
    const { addRating, isFavorited } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      })
    );

    await waitForEmission(isFavorited, 2);
    await addRating(SimpleRating.Great, get(isFavorited));

    expect(invalidate)
      .toHaveBeenCalledWith(InvalidateAction.Rated('movie'));
    expect(invalidate)
      .toHaveBeenNthCalledWith(2, InvalidateAction.Favorited('movie'));
  });
});

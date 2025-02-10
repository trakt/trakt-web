import { SimpleRating } from '$lib/models/SimpleRating.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRatings } from './useRatings.ts';

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
  });
});

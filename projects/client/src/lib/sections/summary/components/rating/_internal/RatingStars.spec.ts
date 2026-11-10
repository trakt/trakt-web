import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RatingStars from './RatingStars.svelte';

function renderStars(
  props: Partial<{
    rating: number;
    isRating: boolean;
    variant: 'full' | 'half';
  }> = {},
) {
  const onAddRating = vi.fn();
  const onRemoveRating = vi.fn();
  const result = render(RatingStars, {
    props: { isRating: false, onAddRating, onRemoveRating, ...props },
  });

  return { ...result, onAddRating, onRemoveRating };
}

describe('component: RatingStars', () => {
  it('should expose an accessible rating slider', () => {
    renderStars();

    expect(screen.getByRole('slider', { name: 'Rate' })).toHaveAttribute(
      'aria-valuemax',
      '5',
    );
    expect(screen.getByLabelText('Rate with 3 stars.')).toBeInTheDocument();
  });

  it('should reflect the committed rating on the star scale', () => {
    renderStars({ rating: 8 });

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '4');
  });

  it('should show the committed star count in the preview label', () => {
    renderStars({ rating: 7 });

    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('should add a rating on the 0-10 scale with the keyboard', async () => {
    const user = userEvent.setup();
    const { onAddRating } = renderStars({ rating: 8, variant: 'full' });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onAddRating).toHaveBeenCalledOnce();
    expect(onAddRating.mock.calls.at(0)?.at(0)).toBe(10);
  });

  it('should step by half stars in the half variant', async () => {
    const user = userEvent.setup();
    const { onAddRating } = renderStars({ rating: 8, variant: 'half' });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onAddRating.mock.calls.at(0)?.at(0)).toBe(9);
  });

  it('should remove the rating when stepping down to zero', async () => {
    const user = userEvent.setup();
    const { onAddRating, onRemoveRating } = renderStars({
      rating: 2,
      variant: 'full',
    });

    await user.tab();
    await user.keyboard('{ArrowLeft}');

    expect(onRemoveRating).toHaveBeenCalledOnce();
    expect(onAddRating).not.toHaveBeenCalled();
  });

  it('should not commit when the rating is already being saved', async () => {
    const user = userEvent.setup();
    const { onAddRating, onRemoveRating } = renderStars({ isRating: true });

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onAddRating).not.toHaveBeenCalled();
    expect(onRemoveRating).not.toHaveBeenCalled();
  });
});

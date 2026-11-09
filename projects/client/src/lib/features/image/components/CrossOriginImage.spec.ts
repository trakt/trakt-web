import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import CrossOriginImage from './CrossOriginImage.svelte';

const SEASON_POSTER = 'https://media.trakt.tv/seasons/1/thumb/poster.webp';
const SHOW_POSTER = 'https://media.trakt.tv/shows/2/thumb/poster.webp';

describe('CrossOriginImage', () => {
  it('should switch to the fallback when the image fails', async () => {
    render(CrossOriginImage, {
      src: SEASON_POSTER,
      fallback: SHOW_POSTER,
      alt: 'poster',
    });

    const image = screen.getByRole('img');
    await fireEvent.error(image);

    await waitFor(() => expect(image.getAttribute('src')).toBe(SHOW_POSTER));
  });

  it('should end on the placeholder and report the image as missing', async () => {
    const onmissing = vi.fn();
    render(CrossOriginImage, {
      src: SEASON_POSTER,
      alt: 'poster',
      onmissing,
    });

    const image = screen.getByRole('img');
    await fireEvent.error(image);

    await waitFor(() =>
      expect(image.getAttribute('src')).toBe(MEDIA_POSTER_PLACEHOLDER),
    );
    expect(onmissing).toHaveBeenCalledOnce();
  });

  it('should report a logo without a placeholder as missing', async () => {
    const onmissing = vi.fn();
    render(CrossOriginImage, {
      src: 'https://media.trakt.tv/shows/2/medium/logo.webp',
      alt: 'logo',
      onmissing,
    });

    await fireEvent.error(screen.getByRole('img'));

    await waitFor(() => expect(onmissing).toHaveBeenCalledOnce());
  });
});

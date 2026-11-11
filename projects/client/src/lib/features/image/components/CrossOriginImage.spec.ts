import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CrossOriginImage from './CrossOriginImage.svelte';

const locale = vi.hoisted(() => ({ current: 'en' }));

vi.mock('$lib/features/i18n/index.ts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('$lib/features/i18n/index.ts')>()),
  getLocale: () => locale.current,
}));

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

  describe('localized posters', () => {
    const poster = (id: number, slot = 'poster') =>
      `https://media.trakt.tv/movies/${id}/medium/${slot}.webp`;

    const manifestRequests: string[] = [];

    const serveManifest = (langsById: Record<string, string[]>) =>
      server.use(
        http.get(
          'https://media.trakt.tv/movies/:id/images.json',
          ({ params }) => {
            manifestRequests.push(String(params.id));
            return HttpResponse.json({
              poster: { langs: langsById[String(params.id)] ?? [] },
            });
          },
        ),
      );

    afterEach(() => {
      locale.current = 'en';
      manifestRequests.length = 0;
    });

    it('should render the plain poster for english without a manifest', () => {
      serveManifest({ '1': ['fr'] });
      render(CrossOriginImage, { src: poster(1), alt: 'poster' });

      expect(screen.getByRole('img').getAttribute('src')).toBe(poster(1));
      expect(manifestRequests).toEqual([]);
    });

    it('should render the language poster when the manifest lists it', async () => {
      locale.current = 'pt-BR';
      serveManifest({ '2': ['pt'] });
      render(CrossOriginImage, { src: poster(2), alt: 'poster' });

      await waitFor(() =>
        expect(screen.getByRole('img').getAttribute('src')).toBe(
          poster(2, 'poster-pt'),
        ),
      );
    });

    it('should render the main poster when the manifest lacks the language', async () => {
      locale.current = 'fr-FR';
      serveManifest({ '5': ['de'] });
      render(CrossOriginImage, { src: poster(5), alt: 'poster' });

      await waitFor(() =>
        expect(screen.getByRole('img').getAttribute('src')).toBe(poster(5)),
      );
    });

    it('should fall back to the poster, then the placeholder', async () => {
      locale.current = 'fr-FR';
      serveManifest({ '3': ['fr'] });
      const onmissing = vi.fn();
      render(CrossOriginImage, { src: poster(3), alt: 'poster', onmissing });

      const image = screen.getByRole('img');
      await waitFor(() =>
        expect(image.getAttribute('src')).toBe(poster(3, 'poster-fr')),
      );

      await fireEvent.error(image);
      await waitFor(() => expect(image.getAttribute('src')).toBe(poster(3)));
      expect(onmissing).not.toHaveBeenCalled();

      await fireEvent.error(image);
      await waitFor(() =>
        expect(image.getAttribute('src')).toBe(MEDIA_POSTER_PLACEHOLDER),
      );
      expect(onmissing).toHaveBeenCalledOnce();
    });

    it('should fetch each manifest once', async () => {
      locale.current = 'fr-FR';
      serveManifest({ '4': [] });
      render(CrossOriginImage, { src: poster(4), alt: 'a' });
      render(CrossOriginImage, { src: poster(4), alt: 'b' });

      await waitFor(() =>
        expect(screen.getByAltText('b').getAttribute('src')).toBe(poster(4)),
      );
      expect(manifestRequests).toEqual(['4']);
    });
  });
});

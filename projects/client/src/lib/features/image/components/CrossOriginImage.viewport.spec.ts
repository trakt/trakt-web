import { render, screen, waitFor } from '@testing-library/svelte';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CrossOriginImage from './CrossOriginImage.svelte';

vi.mock('$lib/features/i18n/index.ts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('$lib/features/i18n/index.ts')>()),
  getLocale: () => 'fr-FR',
}));

const observed = vi.hoisted(() => ({
  targets: [] as Element[],
  fire: (_target: Element) => {},
}));

vi.hoisted(() => {
  (globalThis as Record<string, unknown>).IntersectionObserver =
    class HeldIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observed.fire = (target) =>
          callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe(target: Element) {
        observed.targets.push(target);
      }
      unobserve() {}
      disconnect() {}
    };
});

const poster = (id: number) =>
  `https://media.trakt.tv/movies/${id}/medium/poster.webp`;

describe('CrossOriginImage: manifest and the viewport', () => {
  const manifestRequests: string[] = [];

  beforeEach(() => {
    server.use(
      http.get(
        'https://media.trakt.tv/movies/:id/images.json',
        ({ params }) => {
          manifestRequests.push(String(params.id));
          return HttpResponse.json({ poster: { langs: [] } });
        },
      ),
    );
  });

  it('should wait for a lazy poster to near the viewport before the manifest', async () => {
    render(CrossOriginImage, { src: poster(10), alt: 'lazy' });
    const image = screen.getByAltText('lazy');

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(manifestRequests).not.toContain('10');
    expect(image.getAttribute('src')).toBeNull();

    observed.fire(image);

    await waitFor(() => expect(image.getAttribute('src')).toBe(poster(10)));
    expect(manifestRequests).toContain('10');
  });

  it('should ask the manifest right away for an eager poster', async () => {
    render(CrossOriginImage, {
      src: poster(11),
      alt: 'eager',
      loading: 'eager',
    });

    await waitFor(() =>
      expect(screen.getByAltText('eager').getAttribute('src')).toBe(poster(11)),
    );
    expect(manifestRequests).toContain('11');
    expect(observed.targets).not.toContain(screen.getByAltText('eager'));
  });

  it('should not observe images that are not localized posters', () => {
    render(CrossOriginImage, {
      src: 'https://media.trakt.tv/users/1/avatar.webp',
      alt: 'avatar',
    });

    expect(observed.targets).not.toContain(screen.getByAltText('avatar'));
  });
});

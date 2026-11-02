import MirShareCard from '$lib/features/share/MirShareCard.svelte';
import type { MirShareData } from '$lib/features/share/models/MirShareData.ts';
import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { loadSystemFont } from '$test/beds/font/loadSystemFont.ts';
import { render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderShareCard } from '../../_internal/renderShareCard.ts';
import { toMirShareData } from './toMirShareData.ts';

const posterPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const data: MirShareData = (() => {
  const mapped = toMirShareData({
    detail: YirDetailMappedMock,
    profile: UserProfileHarryMappedMock,
    year: 2026,
    month: 10,
  });
  const withPoster = <T extends { posterUrl: string }>(item: T) => ({
    ...item,
    posterUrl: posterPng,
  });

  return {
    ...mapped,
    user: { ...mapped.user, avatarUrl: posterPng },
    firstWatched: mapped.firstWatched && withPoster(mapped.firstWatched),
    lastWatched: mapped.lastWatched && withPoster(mapped.lastWatched),
    shows: mapped.shows.map(withPoster),
    movies: mapped.movies.map(withPoster),
  };
})();

function complaints(
  calls: ReadonlyArray<ReadonlyArray<unknown>>,
): ReadonlyArray<string> {
  return calls
    .map((args) => args.map(String).join(' '))
    .filter((message) => !message.startsWith('[MSW]'));
}

function toCardHtml(variant: ShareType) {
  const { container } = render(MirShareCard, { props: { data, variant } });

  const styles = Array.from(document.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('');

  return `${container.innerHTML}<style>${styles}</style>`;
}

describe.skipIf(!process.env.CI)(
  'component: MirShareCard through takumi',
  () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

    for (const variant of variants) {
      it(`should render ${variant} without complaints`, async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});

        const jpeg = await renderShareCard({
          html: toCardHtml(variant),
          variant,
          fonts: [
            {
              name: 'Inter',
              data: new Uint8Array(loadSystemFont()).buffer,
              weight: 400,
              style: 'normal',
            },
          ],
          images: [],
        });

        expect([...jpeg.slice(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
        expect(complaints(warn.mock.calls)).toEqual([]);
        expect(complaints(error.mock.calls)).toEqual([]);
      });
    }
  },
);

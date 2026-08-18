import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloRatingsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRatingsMappedMock.ts';
import { loadSystemFont } from '$test/beds/font/loadSystemFont.ts';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import { render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SHARE_TYPE_DIMENSIONS, type ShareType } from './models/ShareType.ts';
import ShareCard from './ShareCard.svelte';

vi.mock('$lib/features/share/models/ShareType.ts', () => ({
  SHARE_TYPE_DIMENSIONS: {
    'open-graph': { width: 600, height: 315, padding: 25 },
    'feed': { width: 540, height: 540, padding: 20 },
    'story': { width: 540, height: 960, padding: 30 },
  },
}));

const pixelPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==';

const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

const show = {
  media: ShowSiloMappedMock,
  crew: ShowSiloPeopleMappedMock,
  ratings: ShowSiloRatingsMappedMock,
};

function toRootMessage(error: unknown): string {
  type Wrapped = Error & { originalError?: Wrapped };

  let current = error as Wrapped;
  while (current?.originalError) {
    current = current.originalError;
  }

  return current?.message ?? String(error);
}

function complaints(
  calls: ReadonlyArray<ReadonlyArray<unknown>>,
): ReadonlyArray<string> {
  return calls
    .map((args) => args.map(String).join(' '))
    .filter((message) => !message.startsWith('[MSW]'));
}

function toImageResponse(variant: ShareType) {
  const { container } = render(ShareCard, {
    props: { ...show, posterUrl: pixelPng, variant },
  });

  const styles = Array.from(document.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('');

  const { width, height } = SHARE_TYPE_DIMENSIONS[variant];

  return new ImageResponse(
    `${container.innerHTML}<style>${styles}</style>`,
    {
      width,
      height,
      fonts: [{
        name: 'Inter',
        data: loadSystemFont(),
        weight: 400,
        style: 'normal',
      }],
    },
  );
}

function renderPng(variant: ShareType): Promise<ArrayBuffer> {
  return toImageResponse(variant).arrayBuffer().catch((e: unknown) => {
    throw new Error(toRootMessage(e));
  });
}

function isPng(buffer: ArrayBuffer): boolean {
  const signature = new Uint8Array(buffer.slice(0, pngSignature.length));

  return pngSignature.every((byte, index) => signature[index] === byte);
}

describe.skipIf(!process.env.CI)('component: ShareCard through satori', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

  for (const variant of variants) {
    it(`should render ${variant} without complaints`, async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      const png = await renderPng(variant);

      expect(isPng(png)).toBe(true);
      expect(complaints(warn.mock.calls)).toEqual([]);
      expect(complaints(error.mock.calls)).toEqual([]);
    });
  }
});

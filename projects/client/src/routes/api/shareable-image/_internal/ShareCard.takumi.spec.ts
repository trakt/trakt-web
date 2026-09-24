import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloRatingsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRatingsMappedMock.ts';
import { loadSystemFont } from '$test/beds/font/loadSystemFont.ts';
import { render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import { renderShareCard } from './renderShareCard.ts';

vi.mock('$lib/features/share/models/ShareType.ts', () => ({
  SHARE_TYPE_DIMENSIONS: {
    'open-graph': { width: 600, height: 315, padding: 25 },
    'feed': { width: 540, height: 540, padding: 20 },
    'story': { width: 540, height: 960, padding: 30 },
  },
}));

const posterPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGUExURQD/AP///2+9WFEAAAABYktHRAH/Ai3eAAAAB3RJTUUH6gkZChIVQ7T5zgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wOS0yNVQxMDoxODoyMSswMDowMKVPnvUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDktMjVUMTA6MTg6MjErMDA6MDDUEiZJAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA5LTI1VDEwOjE4OjIxKzAwOjAwgwcHlgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

const show = {
  media: ShowSiloMappedMock,
  crew: ShowSiloPeopleMappedMock,
  ratings: ShowSiloRatingsMappedMock,
};

function complaints(
  calls: ReadonlyArray<ReadonlyArray<unknown>>,
): ReadonlyArray<string> {
  return calls
    .map((args) => args.map(String).join(' '))
    .filter((message) => !message.startsWith('[MSW]'));
}

const POSTER_ASPECT_RATIO = 350 / 232;

function toCardHtml(variant: ShareType) {
  const { container } = render(ShareCard, {
    props: { ...show, posterUrl: posterPng, variant },
  });

  const styles = Array.from(document.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('');

  return `${container.innerHTML}<style>${styles}</style>`;
}

function renderCard(variant: ShareType, format: 'jpeg' | 'raw') {
  return renderShareCard({
    html: toCardHtml(variant),
    variant,
    format,
    fonts: [{
      name: 'Inter',
      data: new Uint8Array(loadSystemFont()).buffer,
      weight: 400,
      style: 'normal',
    }],
    images: [],
  });
}

function countPosterPixels(rgba: Uint8Array): number {
  return Array.from({ length: rgba.length / 4 }, (_, i) => i * 4)
    .filter((i) =>
      (rgba[i] ?? 255) < 40 &&
      (rgba[i + 1] ?? 0) > 215 &&
      (rgba[i + 2] ?? 255) < 40
    )
    .length;
}

function expectedPosterArea(variant: ShareType): number {
  const { height, padding } = SHARE_TYPE_DIMENSIONS[variant];
  const posterHeight = {
    'feed': height / 1.25,
    'story': height / 1.75,
    'open-graph': height - padding * 2,
  }[variant];

  return posterHeight * (posterHeight / POSTER_ASPECT_RATIO);
}

describe.skipIf(!process.env.CI)('component: ShareCard through takumi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

  for (const variant of variants) {
    it(`should render ${variant} without complaints`, async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      const jpeg = await renderCard(variant, 'jpeg');

      expect([...jpeg.slice(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
      expect(complaints(warn.mock.calls)).toEqual([]);
      expect(complaints(error.mock.calls)).toEqual([]);
    });

    it(`should draw the ${variant} poster`, async () => {
      const rgba = await renderCard(variant, 'raw');

      expect(countPosterPixels(rgba) / expectedPosterArea(variant))
        .toBeGreaterThan(0.9);
    });
  }
});

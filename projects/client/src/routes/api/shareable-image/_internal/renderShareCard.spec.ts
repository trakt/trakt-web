import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import { describe, expect, it } from 'vitest';
import { renderShareCard } from './renderShareCard.ts';

const SOI = [0xff, 0xd8, 0xff];
const MARKER = 0xff;
const START_OF_FRAME = 0xc0;

const HTML =
  '<div style="display:flex;width:100%;height:100%;background:#1b2b36"></div>';

function readDimensions(bytes: Uint8Array) {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== MARKER) {
      return;
    }

    const marker = bytes[offset + 1];
    const length = ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0);

    if (marker === START_OF_FRAME) {
      return {
        height: ((bytes[offset + 5] ?? 0) << 8) | (bytes[offset + 6] ?? 0),
        width: ((bytes[offset + 7] ?? 0) << 8) | (bytes[offset + 8] ?? 0),
      };
    }

    offset += 2 + length;
  }
}

describe('util: renderShareCard', () => {
  const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

  it.each(variants)('should render %s as a baseline jpeg', async (variant) => {
    const bytes = await renderShareCard({
      html: HTML,
      variant,
      fonts: [],
      images: [],
    });
    const { width, height } = SHARE_TYPE_DIMENSIONS[variant];

    expect([...bytes.slice(0, SOI.length)]).toEqual(SOI);
    expect(readDimensions(bytes)).toEqual({ width, height });
  });
});

import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import { describe, expect, it } from 'vitest';
import { rasterizeShareCard } from './rasterizeShareCard.ts';

const SOI = [0xff, 0xd8, 0xff];
const MARKER = 0xff;
const START_OF_FRAME = 0xc0;

function toSvg(): string {
  return [
    '<svg width="120" height="60" xmlns="http://www.w3.org/2000/svg">',
    '<rect width="120" height="60" fill="#1b2b36"/>',
    '<circle cx="60" cy="30" r="20" fill="#d29d40"/>',
    '</svg>',
  ].join('');
}

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

describe('util: rasterizeShareCard', () => {
  const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

  it.each(variants)('should encode %s as a baseline jpeg', async (variant) => {
    const bytes = new Uint8Array(
      await rasterizeShareCard({ svg: toSvg(), variant }),
    );

    const { width, height } = SHARE_TYPE_DIMENSIONS[variant];

    expect([...bytes.slice(0, SOI.length)]).toEqual(SOI);
    expect(readDimensions(bytes)).toEqual({ width, height });
  });
});

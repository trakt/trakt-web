import { MAX_DATE } from '$lib/utils/constants.ts';
import { describe, expect, it } from 'vitest';
import { buildImageMetadata } from './buildImageMetadata.ts';

const CACHED_AT = new Date('2026-08-17T18:30:00.000Z');
const RELEASED_AT = new Date('2022-02-04T00:00:00.000Z');

function buildFor(effectiveReleaseDate: Date) {
  return buildImageMetadata({
    media: { effectiveReleaseDate },
    cachedAt: CACHED_AT,
  });
}

describe('util: buildImageMetadata', () => {
  it('should record when the image was cached', () => {
    expect(buildFor(RELEASED_AT).cachedAt).toBe('2026-08-17T18:30:00.000Z');
  });

  it('should record when the media was released', () => {
    expect(buildFor(RELEASED_AT).releasedAt).toBe('2022-02-04T00:00:00.000Z');
  });

  it('should record the max date when the release date is unknown', () => {
    expect(buildFor(MAX_DATE).releasedAt).toBe(MAX_DATE.toISOString());
  });
});

import { MAX_DATE } from '$lib/utils/constants.ts';
import { describe, expect, it } from 'vitest';
import { buildImageMetadata } from './buildImageMetadata.ts';

const CACHED_AT = new Date('2026-08-17T18:30:00.000Z');
const RELEASED_AT = new Date('2022-02-04T00:00:00.000Z');
const LAST_AIRED = new Date('2026-05-30T00:00:00.000Z');

type BuildForProps = {
  effectiveReleaseDate?: Date;
  lastAired?: Date | null;
};

function buildFor({ effectiveReleaseDate, lastAired }: BuildForProps = {}) {
  return buildImageMetadata({
    media: {
      effectiveReleaseDate: effectiveReleaseDate ?? RELEASED_AT,
      lastAired,
    },
    cachedAt: CACHED_AT,
  });
}

describe('util: buildImageMetadata', () => {
  it('should record when the image was cached', () => {
    expect(buildFor().cachedAt).toBe('2026-08-17T18:30:00.000Z');
  });

  describe('for movies', () => {
    it('should anchor on the release date', () => {
      expect(buildFor().releasedAt).toBe('2022-02-04T00:00:00.000Z');
    });

    it('should anchor on the max date when the release date is unknown', () => {
      expect(buildFor({ effectiveReleaseDate: MAX_DATE }).releasedAt)
        .toBe(MAX_DATE.toISOString());
    });
  });

  describe('for shows', () => {
    it('should anchor on the last aired episode', () => {
      expect(buildFor({ lastAired: LAST_AIRED }).releasedAt)
        .toBe('2026-05-30T00:00:00.000Z');
    });

    it('should anchor on the release date when nothing has aired yet', () => {
      expect(buildFor({ lastAired: null }).releasedAt)
        .toBe('2022-02-04T00:00:00.000Z');
    });
  });
});

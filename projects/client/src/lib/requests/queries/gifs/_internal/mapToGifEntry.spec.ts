import { GifTrendingMappedMock } from '$mocks/data/gifs/mapped/GifTrendingMappedMock.ts';
import { GifTrendingResponseMock } from '$mocks/data/gifs/response/GifTrendingResponseMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { describe, expect, it } from 'vitest';
import { KlipyGifResponseSchema } from './KlipyGifResponse.ts';
import { mapToGifEntry } from './mapToGifEntry.ts';

describe('util: mapToGifEntry', () => {
  const response = KlipyGifResponseSchema.parse(
    assertDefined(GifTrendingResponseMock.data.data.at(0)),
  );

  it('should map a klipy gif to a gif entry', () => {
    expect(mapToGifEntry(response)).to.deep.equal(
      assertDefined(GifTrendingMappedMock.at(0)),
    );
  });

  it('should fall back to the small gif when klipy has no webp', () => {
    const withoutWebp = KlipyGifResponseSchema.parse({
      ...response,
      file: {
        ...response.file,
        sm: { gif: response.file.sm.gif },
      },
    });

    expect(mapToGifEntry(withoutWebp).preview).to.deep.equal(
      response.file.sm.gif,
    );
  });
});

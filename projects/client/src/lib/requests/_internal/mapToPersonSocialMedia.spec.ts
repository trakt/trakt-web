import { PersonFergusonResponseMock } from '$mocks/data/people/response/PersonFergusonResponseMock.ts';
import type { PersonResponse } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { mapToPersonSocialMedia } from './mapToPersonSocialMedia.ts';

describe('mapToPersonSocialMedia', () => {
  it('should map the extra social ids', () => {
    const response = {
      ...PersonFergusonResponseMock,
      social_ids: {
        twitter: null,
        facebook: 'keanu',
        instagram: null,
        tiktok: 'keanu.tok',
        youtube: 'UC0000000000000000000000',
        wikidata: 'Q43416',
        wikipedia: 'Keanu_Reeves',
        wikipedia_language: 'de',
      },
    } as PersonResponse;

    expect(mapToPersonSocialMedia(response)).to.deep.equal({
      x: null,
      facebook: 'keanu',
      instagram: null,
      tiktok: 'keanu.tok',
      youtube: 'UC0000000000000000000000',
      wikidata: 'Q43416',
      wikipedia: 'Keanu_Reeves',
      wikipediaLanguage: 'de',
    });
  });

  it('should default the extra social ids an older response lacks', () => {
    const result = mapToPersonSocialMedia(PersonFergusonResponseMock);

    expect(result?.tiktok).to.equal(null);
    expect(result?.wikipediaLanguage).to.equal(null);
  });

  it('should map nothing without social ids', () => {
    expect(
      mapToPersonSocialMedia({
        ...PersonFergusonResponseMock,
        social_ids: null,
      }),
    ).to.equal(undefined);
  });
});

import { AwardCatalogMappedMock } from '$mocks/data/awards/mapped/AwardCatalogMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toSmartListAwardsForType } from './toSmartListAwardsForType.ts';

const ceremoniesFor = (type: 'movie' | 'show' | 'media') =>
  toSmartListAwardsForType({ catalog: AwardCatalogMappedMock, type }).map(
    (ceremony) => ceremony.slug,
  );

describe('util: toSmartListAwardsForType', () => {
  it('should offer movie ceremonies for movies', () => {
    expect(ceremoniesFor('movie')).toEqual(['oscars', 'golden-globes']);
  });

  it('should offer show ceremonies for shows', () => {
    expect(ceremoniesFor('show')).toEqual(['golden-globes', 'emmys']);
  });

  it('should offer every ceremony for movies and shows', () => {
    expect(ceremoniesFor('media')).toEqual([
      'oscars',
      'golden-globes',
      'emmys',
    ]);
  });
});

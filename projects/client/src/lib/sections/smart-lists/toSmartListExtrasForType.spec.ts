import { AwardCatalogMappedMock } from '$mocks/data/awards/mapped/AwardCatalogMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toSmartListExtrasForType } from './toSmartListExtrasForType.ts';

const filters = {
  networks: ['HBO'],
  ignore_ended: true,
  ignore_released: true,
  keywords: ['heist'],
};

describe('util: toSmartListExtrasForType', () => {
  it('should drop show only filters for movies', () => {
    expect(toSmartListExtrasForType({ filters, type: 'movie' })).toEqual({
      ignore_released: true,
      keywords: ['heist'],
    });
  });

  it('should keep every filter for shows', () => {
    expect(toSmartListExtrasForType({ filters, type: 'show' })).toEqual(
      filters,
    );
  });

  it('should keep every filter for movies and shows', () => {
    expect(toSmartListExtrasForType({ filters, type: 'media' })).toEqual(
      filters,
    );
  });

  describe('awards', () => {
    const awards = {
      awards: ['oscars-best-picture', 'emmys-outstanding-drama-series'],
      award_won: true,
      award_years: [2000, 2026],
    };

    it('should keep only movie awards for movies', () => {
      expect(
        toSmartListExtrasForType({
          filters: awards,
          type: 'movie',
          catalog: AwardCatalogMappedMock,
        }),
      ).toEqual({ ...awards, awards: ['oscars-best-picture'] });
    });

    it('should keep only show awards for shows', () => {
      expect(
        toSmartListExtrasForType({
          filters: awards,
          type: 'show',
          catalog: AwardCatalogMappedMock,
        }),
      ).toEqual({ ...awards, awards: ['emmys-outstanding-drama-series'] });
    });

    it('should drop the award settings once no award fits the type', () => {
      expect(
        toSmartListExtrasForType({
          filters: {
            ...awards,
            awards: ['oscars-best-picture'],
            keywords: ['heist'],
          },
          type: 'show',
          catalog: AwardCatalogMappedMock,
        }),
      ).toEqual({ keywords: ['heist'] });
    });

    it('should keep both types of a ceremony that covers both', () => {
      expect(
        toSmartListExtrasForType({
          filters: { awards: ['golden-globes-best-television-series-drama'] },
          type: 'movie',
          catalog: AwardCatalogMappedMock,
        }),
      ).toEqual({ awards: ['golden-globes-best-television-series-drama'] });
    });

    it('should keep awards it does not know', () => {
      expect(
        toSmartListExtrasForType({
          filters: { awards: ['baftas-best-film'] },
          type: 'movie',
          catalog: AwardCatalogMappedMock,
        }),
      ).toEqual({ awards: ['baftas-best-film'] });
    });
  });
});

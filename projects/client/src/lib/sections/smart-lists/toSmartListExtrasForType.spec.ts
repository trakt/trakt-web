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
});

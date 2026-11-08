import { describe, expect, it } from 'vitest';
import { toLogoFilename } from './toLogoFilename.ts';

describe('util: toLogoFilename', () => {
  it('should name a vector file without a size', () => {
    expect(
      toLogoFilename({ name: 'trakt-logo', format: 'svg', size: 1024 }),
    ).toBe('trakt-logo.svg');
  });

  it('should add the size to raster files', () => {
    expect(
      toLogoFilename({ name: 'trakt-logo', format: 'png', size: 512 }),
    ).toBe('trakt-logo-512.png');
  });

  it('should add the backdrop unless it is light', () => {
    expect(
      toLogoFilename({
        name: 'trakt-logo',
        format: 'jpg',
        size: 2048,
        backdrop: 'dark',
      }),
    ).toBe('trakt-logo-dark-2048.jpg');
    expect(
      toLogoFilename({
        name: 'trakt-logo',
        format: 'svg',
        size: 2048,
        backdrop: 'light',
      }),
    ).toBe('trakt-logo.svg');
  });
});

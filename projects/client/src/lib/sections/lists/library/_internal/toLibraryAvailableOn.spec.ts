import { describe, expect, it } from 'vitest';
import { toLibraryAvailableOn } from './toLibraryAvailableOn.ts';

describe('util: toLibraryAvailableOn', () => {
  it('should request the digital filter for the synced library', () => {
    expect(toLibraryAvailableOn('plex')).toBe('digital');
  });

  it('should keep the custom library filter', () => {
    expect(toLibraryAvailableOn('other')).toBe('other');
  });
});

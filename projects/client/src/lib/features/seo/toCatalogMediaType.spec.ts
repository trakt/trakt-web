import { describe, expect, it } from 'vitest';
import { toCatalogMediaType } from './toCatalogMediaType.ts';

describe('util: toCatalogMediaType', () => {
  it('should map the plural url segments to media types', () => {
    expect(toCatalogMediaType('shows')).to.equal('show');
    expect(toCatalogMediaType('movies')).to.equal('movie');
  });

  it('should reject an unknown segment', () => {
    expect(toCatalogMediaType('people')).to.equal(undefined);
    expect(toCatalogMediaType('')).to.equal(undefined);
  });
});

import { describe, expect, it } from 'vitest';
import { toLoreMovieTitle } from './toLoreMovieTitle.ts';

describe('util: toLoreMovieTitle', () => {
  it('should append the year', () => {
    expect(toLoreMovieTitle({ title: 'Dune', year: 2021 })).toBe('Dune (2021)');
  });

  it('should keep the bare title without a year', () => {
    expect(toLoreMovieTitle({ title: 'Dune', year: null })).toBe('Dune');
  });
});

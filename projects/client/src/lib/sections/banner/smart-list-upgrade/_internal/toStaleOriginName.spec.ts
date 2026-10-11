import { describe, expect, it } from 'vitest';
import { toStaleOriginName } from './toStaleOriginName.ts';

describe('toStaleOriginName', () => {
  it('maps a known origin to its display name', () => {
    expect(toStaleOriginName('mdblist')).toBe('MDBList');
  });

  it('ignores the casing of a known origin', () => {
    expect(toStaleOriginName('MDBList')).toBe('MDBList');
  });

  it('falls back to the raw name for an unknown origin', () => {
    expect(toStaleOriginName('letterboxd')).toBe('letterboxd');
  });
});

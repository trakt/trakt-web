import { describe, expect, it } from 'vitest';
import { toLibraryChoice } from './toLibraryChoice.ts';

describe('toLibraryChoice', () => {
  it('adds a library once', () => {
    expect(toLibraryChoice(['1'], '2', true)).to.deep.equal(['1', '2']);
    expect(toLibraryChoice(['1'], '1', true)).to.deep.equal(['1']);
  });

  it('removes a library', () => {
    expect(toLibraryChoice(['1', '2'], '1', false)).to.deep.equal(['2']);
  });
});

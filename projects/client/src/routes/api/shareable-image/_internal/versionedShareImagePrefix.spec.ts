import { describe, expect, it } from 'vitest';
import { versionedShareImagePrefix } from './versionedShareImagePrefix.ts';

describe('util: versionedShareImagePrefix', () => {
  it('should nest the current version under the kind root', () => {
    const { root, current } = versionedShareImagePrefix('mir');

    expect(root).toBe('images/share/mir/');
    expect(current).toMatch(/^images\/share\/mir\/v\d+\/$/);
  });
});

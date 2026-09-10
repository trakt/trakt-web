import { describe, expect, it } from 'vitest';
import { isNoIndexPath } from './isNoIndexPath.ts';

describe('util: isNoIndexPath', () => {
  it('should mark user-owned surfaces as no-index', () => {
    expect(isNoIndexPath('/profile')).to.equal(true);
    expect(isNoIndexPath('/profile/joka42')).to.equal(true);
    expect(isNoIndexPath('/profile/joka42/favorites')).to.equal(true);
    expect(isNoIndexPath('/users/peekay5000/lists/wanna-watch')).to.equal(true);
  });

  it('should keep catalog surfaces indexable', () => {
    expect(isNoIndexPath('/')).to.equal(false);
    expect(isNoIndexPath('/shows/silo')).to.equal(false);
    expect(isNoIndexPath('/people/george-c-scott')).to.equal(false);
    expect(isNoIndexPath('/lists/official/top-movies')).to.equal(false);
  });

  it('should not match a prefix that only starts the same', () => {
    expect(isNoIndexPath('/profiles')).to.equal(false);
    expect(isNoIndexPath('/userspace')).to.equal(false);
  });
});

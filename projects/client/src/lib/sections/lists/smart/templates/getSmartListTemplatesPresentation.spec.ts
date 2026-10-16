import { describe, expect, it } from 'vitest';
import { getSmartListTemplatesPresentation } from './getSmartListTemplatesPresentation.ts';

describe('util: getSmartListTemplatesPresentation', () => {
  it('should show the strip to a user without lists who has not hidden it', () => {
    expect(
      getSmartListTemplatesPresentation({ listCount: 0, isHidden: false }),
    ).toBe('strip');
  });

  it('should collapse to the link once the strip is hidden', () => {
    expect(
      getSmartListTemplatesPresentation({ listCount: 0, isHidden: true }),
    ).toBe('link');
  });

  it('should show the link to a user with one list', () => {
    expect(
      getSmartListTemplatesPresentation({ listCount: 1, isHidden: false }),
    ).toBe('link');
  });

  it('should show the link to a user with five lists', () => {
    expect(
      getSmartListTemplatesPresentation({ listCount: 5, isHidden: false }),
    ).toBe('link');
  });

  it('should show the link to a user with lists who also hid the strip', () => {
    expect(
      getSmartListTemplatesPresentation({ listCount: 2, isHidden: true }),
    ).toBe('link');
  });
});

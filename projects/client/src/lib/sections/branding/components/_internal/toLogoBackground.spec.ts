import { describe, expect, it } from 'vitest';
import { toLogoBackground } from './toLogoBackground.ts';

describe('util: toLogoBackground', () => {
  it('should fill each backdrop with its brand color', () => {
    expect(toLogoBackground('light')).toBe('#FFFFFF');
    expect(toLogoBackground('dark')).toBe('#111111');
    expect(toLogoBackground('brand')).toBe('#6438D0');
  });

  it('should leave the transparent backdrop unfilled', () => {
    expect(toLogoBackground('transparent')).toBeUndefined();
  });
});

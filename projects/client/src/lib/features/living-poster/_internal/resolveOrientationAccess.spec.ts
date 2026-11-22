import { describe, expect, it } from 'vitest';
import { resolveOrientationAccess } from './resolveOrientationAccess.ts';

describe('util: resolveOrientationAccess', () => {
  it('should ask when nothing was decided yet', () => {
    expect(
      resolveOrientationAccess({
        detected: 'needs-permission',
        remembered: null,
      }),
    ).toBe('needs-permission');
  });

  it('should listen right away after an earlier grant', () => {
    expect(
      resolveOrientationAccess({
        detected: 'needs-permission',
        remembered: 'granted',
      }),
    ).toBe('available');
  });

  it('should stay denied after an earlier denial', () => {
    expect(
      resolveOrientationAccess({
        detected: 'needs-permission',
        remembered: 'denied',
      }),
    ).toBe('denied');
  });

  it.each(['unsupported', 'available'] as const)(
    'should keep %s whatever was remembered',
    (detected) => {
      expect(resolveOrientationAccess({ detected, remembered: 'denied' })).toBe(
        detected,
      );
    },
  );
});

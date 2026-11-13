import { describe, expect, it } from 'vitest';
import { toLoginReturnPath } from './toLoginReturnPath.ts';

describe('util: toLoginReturnPath', () => {
  it('should keep the vip path with its search params', () => {
    expect(
      toLoginReturnPath('/vip?source=yir-email&return=/users/me/year/2027'),
    ).toBe('/vip?source=yir-email&return=/users/me/year/2027');
  });

  it('should keep the bare vip path', () => {
    expect(toLoginReturnPath('/vip')).toBe('/vip');
  });

  it('should reject paths that are not returnable', () => {
    expect(toLoginReturnPath('/users/me/year/2027')).toBeNull();
    expect(toLoginReturnPath('/vip/cancel')).toBeNull();
  });

  it('should reject other origins', () => {
    expect(toLoginReturnPath('https://evil.example/vip')).toBeNull();
    expect(toLoginReturnPath('//evil.example/vip')).toBeNull();
    expect(toLoginReturnPath('/\\evil.example/vip')).toBeNull();
  });

  it('should reject non string values', () => {
    expect(toLoginReturnPath(null)).toBeNull();
    expect(toLoginReturnPath(undefined)).toBeNull();
    expect(toLoginReturnPath({ returnTo: '/vip' })).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { toYirEmailReturnPath } from './toYirEmailReturnPath.ts';

const parse = (path: string) =>
  toYirEmailReturnPath(new URL(path, 'https://app.trakt.tv'));

describe('util: toYirEmailReturnPath', () => {
  it('should return the path for the yir-email source', () => {
    expect(
      parse('/vip?source=yir-email&return=%2Fusers%2Fme%2Fyear%2F2025'),
    ).toBe('/users/me/year/2025');
  });

  it('should ignore the email tracking params', () => {
    expect(
      parse(
        '/vip?source=yir-email&return=%2Fusers%2Fme%2Fyear%2F2025&utm_source=email&utm_medium=yir',
      ),
    ).toBe('/users/me/year/2025');
  });

  it('should accept the all-time route', () => {
    expect(parse('/vip?source=yir-email&return=/users/me/year/all')).toBe(
      '/users/me/year/all',
    );
  });

  it.each([
    ['a missing source', '/vip?return=%2Fusers%2Fme%2Fyear%2F2025'],
    [
      'another source',
      '/vip?source=yir&return=%2Fusers%2Fme%2Fyear%2F2025',
    ],
    [
      'a promotion source',
      '/vip?source=promotion-black-friday&return=%2Fusers%2Fme%2Fyear%2F2025',
    ],
    ['a missing return', '/vip?source=yir-email'],
    ['an empty return', '/vip?source=yir-email&return='],
    ['a protocol-relative url', '/vip?source=yir-email&return=//evil.com'],
    [
      'an encoded protocol-relative url',
      '/vip?source=yir-email&return=%2F%2Fevil.com%2Fusers%2Fme%2Fyear%2F2025',
    ],
    [
      'an absolute url',
      '/vip?source=yir-email&return=https%3A%2F%2Fevil.com%2Fusers%2Fme%2Fyear%2F2025',
    ],
    ['a backslash path', '/vip?source=yir-email&return=%2F%5Cevil.com'],
    ['another path', '/vip?source=yir-email&return=%2Fsettings'],
    [
      'a trailing path segment',
      '/vip?source=yir-email&return=%2Fusers%2Fme%2Fyear%2F2025%2Fextra',
    ],
    [
      'a query on the path',
      '/vip?source=yir-email&return=%2Fusers%2Fme%2Fyear%2F2025%3Fnext%3Dx',
    ],
    [
      'a non-year segment',
      '/vip?source=yir-email&return=%2Fusers%2Fme%2Fyear%2Fabc',
    ],
    [
      'a trailing newline',
      '/vip?source=yir-email&return=%2Fusers%2Fme%2Fyear%2F2025%0A',
    ],
  ])('should ignore %s', (_, path) => {
    expect(parse(path)).toBeNull();
  });
});

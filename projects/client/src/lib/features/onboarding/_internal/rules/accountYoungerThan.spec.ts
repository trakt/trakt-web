import { ExtendedUserMappedMock } from '$mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { accountYoungerThan } from './accountYoungerThan.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const JOINED_AT = new Date('2026-01-01T00:00:00Z');
const USER = { ...ExtendedUserMappedMock, joinedAt: JOINED_AT };
const dayN = (day: number) => JOINED_AT.getTime() + day * DAY_MS;
const isNewAccount = accountYoungerThan({ days: 30 });

describe('rule: accountYoungerThan', () => {
  it('should accept an account that just joined', () => {
    expect(isNewAccount({ user: USER, startedAt: null, now: dayN(0) })).toBe(
      true,
    );
  });

  it('should reject an account 31 days old that never started', () => {
    expect(isNewAccount({ user: USER, startedAt: null, now: dayN(31) })).toBe(
      false,
    );
  });

  it('should reject a missing join date', () => {
    expect(
      isNewAccount({
        user: { ...USER, joinedAt: undefined },
        startedAt: null,
        now: dayN(0),
      }),
    ).toBe(false);
  });

  it('should reject an invalid join date', () => {
    expect(
      isNewAccount({
        user: { ...USER, joinedAt: new Date('not a date') },
        startedAt: null,
        now: dayN(0),
      }),
    ).toBe(false);
  });

  it('should keep the set for an account that started on day 29', () => {
    expect(
      isNewAccount({ user: USER, startedAt: dayN(29), now: dayN(40) }),
    ).toBe(true);
  });

  it('should use the window it was given', () => {
    expect(
      accountYoungerThan({ days: 90 })({
        user: USER,
        startedAt: null,
        now: dayN(60),
      }),
    ).toBe(true);
  });
});

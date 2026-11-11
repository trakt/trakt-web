import { describe, expect, it } from 'vitest';
import { toListLimitMessage } from './toListLimitMessage.ts';

describe('toListLimitMessage', () => {
  it('should explain a full list', () => {
    expect(
      toListLimitMessage({ status: 'list-full', limit: 1000, isVip: false }),
    ).toBe(
      'This list is full at 1,000 items. Start a new list to keep adding.',
    );
  });

  it('should mention VIP when a free user filled all lists', () => {
    expect(
      toListLimitMessage({ status: 'lists-full', limit: 500, isVip: false }),
    ).toBe(
      'Your lists are full: your plan holds 500 items across all lists. VIP raises that limit.',
    );
  });

  it('should not mention VIP when a VIP user filled all lists', () => {
    expect(
      toListLimitMessage({ status: 'lists-full', limit: 5000, isVip: true }),
    ).toBe('Your lists are full: they hold 5,000 items across all lists.');
  });

  it.each(['added', 'failed'] as const)('should skip a %s result', (status) => {
    expect(toListLimitMessage({ status })).toBeNull();
  });
});

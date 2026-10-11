import { describe, expect, it } from 'vitest';
import { toNudgeMessage } from './toNudgeMessage.ts';

describe('toNudgeMessage', () => {
  it('uses the long wording on desktop', () => {
    expect(toNudgeMessage({ count: 3, isMobile: false })).toBe(
      '3 of your lists can update themselves',
    );
  });

  it('uses the short wording on mobile', () => {
    expect(toNudgeMessage({ count: 3, isMobile: true })).toBe(
      '3 lists can update themselves',
    );
  });

  it('uses the singular wording for one list on mobile', () => {
    expect(toNudgeMessage({ count: 1, isMobile: true })).toBe(
      '1 list can update itself',
    );
  });
});

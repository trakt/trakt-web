import * as m from '$lib/features/i18n/messages.ts';
import { describe, expect, it } from 'vitest';
import { toVipTenureLabel } from './toVipTenureLabel.ts';

describe('util: toVipTenureLabel', () => {
  it('should greet members under a month as new', () => {
    expect(toVipTenureLabel(0)).toBe(m.text_vip_cancel_tenure_new());
  });

  it('should count months under a year', () => {
    expect(toVipTenureLabel(11)).toBe('11 months');
  });

  it('should count whole years from a year on', () => {
    expect(toVipTenureLabel(25)).toBe('2 years');
  });
});

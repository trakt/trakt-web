import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toMemberAuraTone } from './toMemberAuraTone.ts';

const toVeteran = (tier: number): VipVeteran => ({
  since: new Date('2016-01-01'),
  years: tier,
  tier,
});

describe('util: toMemberAuraTone', () => {
  it('should stay purple when the veteran flag is off', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: true, veteran: toVeteran(10) },
        isVeteranEnabled: false,
      }),
    ).toBe('vip');
  });

  it('should stay purple for a member without a veteran tier', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: true, veteran: null },
        isVeteranEnabled: true,
      }),
    ).toBe('vip');
  });

  it('should stay purple for a non VIP member', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: false, veteran: toVeteran(10) },
        isVeteranEnabled: true,
      }),
    ).toBe('vip');
  });

  it('should follow the veteran tier of a VIP member', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: true, veteran: toVeteran(10) },
        isVeteranEnabled: true,
      }),
    ).toBe('gold');
  });
});

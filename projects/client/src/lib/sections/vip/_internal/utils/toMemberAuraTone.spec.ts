import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toMemberAuraTone } from './toMemberAuraTone.ts';

const toVeteran = (title: VipVeteran['title']): VipVeteran => ({
  since: new Date('2016-01-01'),
  years: 10,
  title,
});

describe('util: toMemberAuraTone', () => {
  it('should stay purple when the veteran flag is off', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: true, veteran: toVeteran('legend') },
        isVeteranEnabled: false,
      }),
    ).toBe('var(--color-glow-vip-badge-vip)');
  });

  it('should stay purple for a non VIP member', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: false, veteran: toVeteran('legend') },
        isVeteranEnabled: true,
      }),
    ).toBe('var(--color-glow-vip-badge-vip)');
  });

  it('should use the VIP tier colour for a member without a veteran title', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: true, veteran: null },
        isVeteranEnabled: true,
      }),
    ).toBe('var(--color-user-tier-vip-ring)');
  });

  it('should follow the user tier of a VIP member', () => {
    expect(
      toMemberAuraTone({
        member: { isVip: true, veteran: toVeteran('legend') },
        isVeteranEnabled: true,
      }),
    ).toBe('var(--color-user-tier-legend-ring)');
  });
});

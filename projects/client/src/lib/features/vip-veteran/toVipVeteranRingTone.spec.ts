import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toVipVeteranRingTone } from './toVipVeteranRingTone.ts';

const veteran = (tier: number, title: VipVeteran['title']): VipVeteran => ({
  since: new Date('2016-03-01T10:00:00.000Z'),
  years: tier,
  tier,
  title,
});

describe('util: toVipVeteranRingTone', () => {
  it('should leave the ring purple below five years', () => {
    expect(toVipVeteranRingTone(veteran(3, null))).to.equal(null);
  });

  it('should colour the ring for veterans and legends', () => {
    expect(toVipVeteranRingTone(veteran(5, 'veteran'))).to.equal('copper');
    expect(toVipVeteranRingTone(veteran(7, 'veteran'))).to.equal('silver');
    expect(toVipVeteranRingTone(veteran(10, 'legend'))).to.equal('gold');
  });

  it('should leave the ring alone without a streak', () => {
    expect(toVipVeteranRingTone(null)).to.equal(null);
  });
});

import type { ProfileResponse } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { mapToVipVeteran } from './mapToVipVeteran.ts';

const baseResponse: ProfileResponse = {
  username: 'harrier_dubois',
  private: false,
  deleted: false,
  ids: { slug: 'harry_du_bois', trakt: 41152 },
  vip_veteran_since: '2016-03-01T10:00:00.000Z',
  vip_veteran_years: 10,
  vip_veteran_tier: 10,
  vip_veteran_title: 'legend',
};

describe('util: mapToVipVeteran', () => {
  it('should map a live streak', () => {
    expect(mapToVipVeteran(baseResponse)).to.deep.equal({
      since: new Date('2016-03-01T10:00:00.000Z'),
      years: 10,
      tier: 10,
      title: 'legend',
      graceEndsAt: null,
    });
  });

  it('should map the grace end on your own profile', () => {
    const result = mapToVipVeteran({
      ...baseResponse,
      vip_grace_ends_at: '2026-11-05T18:35:34.000Z',
    });

    expect(result?.graceEndsAt).to.deep.equal(
      new Date('2026-11-05T18:35:34.000Z'),
    );
  });

  it('should return null without a live streak', () => {
    expect(
      mapToVipVeteran({
        ...baseResponse,
        vip_veteran_since: null,
        vip_veteran_tier: null,
      }),
    ).to.equal(null);
  });

  it('should drop titles it does not know', () => {
    const result = mapToVipVeteran({
      ...baseResponse,
      vip_veteran_title: 'champion',
    });

    expect(result?.title).to.equal(null);
  });
});

import { describe, expect, it } from 'vitest';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';
import { pickBestVipOffer } from './pickBestVipOffer.ts';

const retention: VipRetentionOffer = {
  source: 'retention',
  discountedAmount: 1008,
  totalPrice: 1337,
  monthlyAmount: 42,
};

const campaign: VipRetentionOffer = {
  source: 'campaign',
  discountedAmount: 420,
  totalPrice: 1337,
  monthlyAmount: 17.5,
};

describe('util: pickBestVipOffer', () => {
  it('should return nothing without offers', () => {
    expect(pickBestVipOffer([null, undefined])).toBeNull();
  });

  it('should return the only available offer', () => {
    expect(pickBestVipOffer([null, campaign])).toBe(campaign);
  });

  it('should pick the offer that saves the most', () => {
    expect(pickBestVipOffer([retention, campaign])).toBe(campaign);
  });

  it('should keep the retention offer when a campaign saves less', () => {
    const smallCampaign = { ...campaign, discountedAmount: 1234 };

    expect(pickBestVipOffer([retention, smallCampaign])).toBe(retention);
  });

  it('should keep the first offer when both save the same', () => {
    const sameCampaign = { ...campaign, discountedAmount: 1008 };

    expect(pickBestVipOffer([retention, sameCampaign])).toBe(retention);
  });
});

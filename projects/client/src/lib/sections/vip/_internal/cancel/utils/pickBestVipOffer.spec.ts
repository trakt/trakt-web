import { describe, expect, it } from 'vitest';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';
import { pickBestVipOffer } from './pickBestVipOffer.ts';

const retention: VipRetentionOffer = {
  source: 'retention',
  discountedAmount: 60,
  totalPrice: 96,
  monthlyAmount: 2.5,
};

const campaign: VipRetentionOffer = {
  source: 'campaign',
  discountedAmount: 48,
  totalPrice: 96,
  monthlyAmount: 2,
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
    const smallCampaign = { ...campaign, discountedAmount: 80 };

    expect(pickBestVipOffer([retention, smallCampaign])).toBe(retention);
  });

  it('should keep the first offer when both save the same', () => {
    const sameCampaign = { ...campaign, discountedAmount: 60 };

    expect(pickBestVipOffer([retention, sameCampaign])).toBe(retention);
  });
});

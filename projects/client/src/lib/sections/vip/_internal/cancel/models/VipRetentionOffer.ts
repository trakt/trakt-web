export type VipRetentionOffer = {
  source: 'retention' | 'campaign';
  discountedAmount: number;
  totalPrice: number;
  monthlyAmount: number;
};

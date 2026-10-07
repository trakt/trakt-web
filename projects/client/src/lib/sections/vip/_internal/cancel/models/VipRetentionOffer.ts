export type VipRetentionOffer = Readonly<{
  source: 'retention' | 'campaign' | 'paypal-switch';
  discountedAmount: number;
  totalPrice: number;
  monthlyAmount: number;
}>;

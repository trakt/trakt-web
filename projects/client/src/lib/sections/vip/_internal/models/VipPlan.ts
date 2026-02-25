export type VipPlan = {
  type: 'monthly' | 'yearly' | 'two_years';
  monthlyPrice: number;
  durationInMonths: number;
  isPopular: boolean;
};

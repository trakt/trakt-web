export type VipPlan = {
  type: 'monthly' | 'yearly' | 'two_years';
  monthlyPrice: number;
  duration: number; //in months; better var name
};

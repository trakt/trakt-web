import type { VipUpsellSource } from './models/VipUpsellSource.ts';

export type UpsellCtaProps = {
  source: VipUpsellSource;
  title?: string;
  variant?: 'default' | 'small';
  surface?: 'card' | 'none';
} & ChildrenProps;

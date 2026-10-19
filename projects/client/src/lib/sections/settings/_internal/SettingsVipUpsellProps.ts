import type { VipUpsellSource } from '$lib/features/upsell/models/VipUpsellSource.ts';
import type { Snippet } from 'svelte';

export type SettingsVipUpsellProps = {
  icon: Snippet;
  title: string;
  description: string;
  source: VipUpsellSource;
};

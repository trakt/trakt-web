import type { Snippet } from 'svelte';

export type SmartListUpgradeCardProps = {
  variant: 'draft' | 'plain';
  title: string;
  summary?: string;
  detail?: string;
  origin: string;
  onDismiss: () => void;
  actions: Snippet;
};

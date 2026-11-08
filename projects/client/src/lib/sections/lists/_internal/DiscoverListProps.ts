import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode';
import type { Snippet } from 'svelte';
import type { DrillListProps } from '../drilldown/DrillListProps';

export type DiscoverListProps = {
  title: string;
  drilldownLabel: string;
  type: DiscoverMode;
  search?: Record<string, string>;
  theme?: string;
  actions?: Snippet;
  scope?: string;
} & Partial<DrillListProps<DiscoverMode>>;

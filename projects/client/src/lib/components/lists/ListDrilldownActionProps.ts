import type { Snippet } from 'svelte';
import type { ListDrilldownProps } from './section-list/models/ListDrilldownProps.ts';

export type ListDrilldownActionProps = {
  drilldown: ListDrilldownProps;
  disabled?: boolean;
  children: Snippet;
};

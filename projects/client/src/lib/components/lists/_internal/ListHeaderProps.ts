import type { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';
import type { Snippet } from 'svelte';
import type { ListDrilldownProps } from '../section-list/models/ListDrilldownProps.ts';

type ListHeaderCollapse = {
  isCollapsed: boolean;
  toggle: () => void;
  label: string;
};

export type ListHeaderProps = {
  title: string;
  subtitle?: string;
  metaInfo?: Snippet;
  titleAction?: Snippet;
  actions?: Snippet;
  listActions?: Snippet;
  navigationType?: DpadNavigationType;
  drilldown?: ListDrilldownProps;
  /** Makes the label itself fold the list away. */
  collapse?: ListHeaderCollapse;
  /** The size of the whole set, not only what the list shows. */
  count?: number;
  /** Narrows the list, beside the label. */
  filters?: Snippet;
} & HTMLElementProps;

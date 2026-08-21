import type { Snippet } from 'svelte';

type TabView = {
  value: string;
  label: string;
  count?: number;
  content: Snippet;
  keepMounted?: boolean;
};

export type TabViewProps = {
  value: string;
  tabs: TabView[];
  onChange?: (value: string) => void;
  tabPosition?: 'top' | 'bottom';
};

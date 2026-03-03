import type { Snippet } from 'svelte';

type TabView = {
  value: string;
  label: string;
  content: Snippet;
};

export type TabViewProps = {
  value: string;
  tabs: TabView[];
  canSwitchTab?: (to: string) => Promise<boolean> | boolean;
  onChange?: (value: string) => void;
  tabPosition?: 'top' | 'bottom';
};

import type { DrilldownSource } from '$lib/sections/lists/components/models/DrilldownSource.ts';

export type ListDrilldownLinkProps = {
  href: string;
  label: string;
  noscroll?: boolean;
  replacestate?: boolean;
  source: DrilldownSource;
  mode?: 'default' | 'always' | 'disabled';
};

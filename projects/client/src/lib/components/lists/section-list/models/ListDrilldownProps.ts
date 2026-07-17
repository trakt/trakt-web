import type { DrilldownSource } from '$lib/sections/lists/components/models/DrilldownSource.ts';

type DrilldownSharedProps = {
  label: string;
  source: DrilldownSource;
  mode?: 'default' | 'always' | 'disabled';
};

type DrilldownLinkProps = DrilldownSharedProps & {
  href: string;
  noscroll?: boolean;
  replacestate?: boolean;
  onClick?: never;
};

type DrilldownActionProps = DrilldownSharedProps & {
  onClick: () => void;
  href?: never;
  noscroll?: never;
  replacestate?: never;
};

export type ListDrilldownProps = DrilldownLinkProps | DrilldownActionProps;

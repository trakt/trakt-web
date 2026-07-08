import type { StatIconKey } from './StatIconKey.ts';

export type AllTimeStatTileProps = {
  stat: StatIconKey;
  label: string;
  value: number | null;
  isLoading: boolean;
};

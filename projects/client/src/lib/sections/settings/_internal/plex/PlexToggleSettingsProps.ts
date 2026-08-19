import type { Snippet } from 'svelte';
import type { PlexMediaKind } from './PlexMediaKind.ts';
import type { PlexSettingKey } from './PlexSettingKey.ts';
import type { PlexToggleParams } from './PlexToggleParams.ts';

type ToggleChip = {
  settingKey: PlexSettingKey;
  label: string;
  ariaLabel: string;
  isActive: boolean;
};

type ToggleRow = {
  mediaKind: PlexMediaKind;
  icon: Snippet;
  title: string;
  chips: ReadonlyArray<ToggleChip>;
};

export type PlexToggleSettingsProps = {
  title: string;
  description: string;
  isLoading: boolean;
  rows: ReadonlyArray<ToggleRow>;
  onToggle: (params: PlexToggleParams) => void;
};

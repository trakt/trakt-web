import type { PlexMediaKind } from './PlexMediaKind.ts';
import type { PlexSettingKey } from './PlexSettingKey.ts';

export type PlexToggleParams = {
  mediaKind: PlexMediaKind;
  settingKey: PlexSettingKey;
  current: boolean;
};

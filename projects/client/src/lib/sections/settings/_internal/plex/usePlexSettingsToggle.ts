import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { plexUpdateSettingsRequest } from '$lib/requests/plex/plexUpdateSettingsRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { PlexToggleParams } from './PlexToggleParams.ts';

type PlexSettingsSection = 'sync' | 'scrobbler';

export function usePlexSettingsToggle(section: PlexSettingsSection) {
  const { invalidate } = useInvalidator();

  return async ({ mediaKind, settingKey, current }: PlexToggleParams) => {
    await plexUpdateSettingsRequest({
      settings: {
        [section]: { toggles: { [mediaKind]: { [settingKey]: !current } } },
      },
    });
    await invalidate(InvalidateAction.Plex.Settings);
  };
}

import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { plexUpdateSettingsRequest } from '$lib/requests/plex/plexUpdateSettingsRequest.ts';
import type { PlexToggleParams } from './PlexToggleParams.ts';

type PlexSettingsSection = 'sync' | 'scrobbler';

export function usePlexSettingsToggle(section: PlexSettingsSection) {
  const toggle = useMutation(defineMutation({
    key: `plex:toggle-${section}`,
    request: ({ mediaKind, settingKey, current }: PlexToggleParams) =>
      plexUpdateSettingsRequest({
        settings: {
          [section]: { toggles: { [mediaKind]: { [settingKey]: !current } } },
        },
      }),
    invalidations: [InvalidateAction.Plex.Settings],
  }));

  return async (params: PlexToggleParams) => {
    await toggle.mutate(params);
  };
}

import { derived, readable } from 'svelte/store';
import { buildPlexLink } from '$lib/features/plex/buildPlexLink.ts';
import { usePlexLibrary } from '$lib/features/plex/usePlexLibrary.ts';
import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import type { MetaInfoProps } from '../../../summary/components/media/useMediaMetaInfo.ts';
import type { LibraryOption } from '../models/LibraryOption.ts';
import { mapToServices } from './mapToServices.ts';

type UseWhereToWatchProps = {
  streamOn?: StreamOn;
} & MetaInfoProps;

export function useWhereToWatch({streamOn, ...target}: UseWhereToWatchProps) {
  const device = getDeviceType(globalThis.navigator.userAgent);
  const services = mapToServices(streamOn);

  if (device !== 'mobile') {
    return {
      services: readable(services),
    };
  }

  const { isInLibrary } = usePlexLibrary(target);

  return {
    services: derived(isInLibrary, ($isInLibrary) => {
      if ($isInLibrary) {
        const plexService: LibraryOption = {
          key: 'library-plex',
          type: 'library',
          source: 'plex',
          link: buildPlexLink(target),
        };

        return [plexService, ...services];
      }

      return services;
    }),
  };
}

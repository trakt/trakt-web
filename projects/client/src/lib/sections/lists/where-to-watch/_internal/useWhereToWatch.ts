import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import { readable } from 'svelte/store';
import type { MetaInfoProps } from '../../../summary/components/media/useMediaMetaInfo.ts';
import { mapToServices } from './mapToServices.ts';

type UseWhereToWatchProps = {
  streamOn?: StreamOn;
} & MetaInfoProps;

export function useWhereToWatch({ streamOn }: UseWhereToWatchProps) {
  const services = mapToServices(streamOn);

  return {
    services: readable(services),
  };
}

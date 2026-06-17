import type { PlexServer } from '@trakt/api';
import { PlexServersResponseMock } from '../response/PlexServersResponseMock.ts';

export const PlexServersMappedMock: PlexServer[] =
  PlexServersResponseMock.servers;

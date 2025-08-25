import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HiddenMediaRequest } from '@trakt/api';
import { setMarker } from '../../../utils/date/Marker.ts';

type DropShowRequest = {
  body: HiddenMediaRequest;
} & ApiParams;

export function dropShowRequest(
  { body, fetch }: DropShowRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .hidden
    .add({
      params: {
        section: 'dropped',
      },
      body,
    })
    .then(({ status }) => {
      setMarker();

      return status === 200;
    });
}

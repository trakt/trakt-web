import { api, type ApiParams } from '$lib/requests/api.ts';
import type { MovieCheckinRequest } from '@trakt/api';

type CheckinMovieParams = {
  body: MovieCheckinRequest;
} & ApiParams;

export function checkinMovieRequest(
  { body, fetch }: CheckinMovieParams,
): Promise<boolean> {
  return api({ fetch })
    .checkin
    .movie({
      body,
    })
    .then(({ status }) => status === 201);
}

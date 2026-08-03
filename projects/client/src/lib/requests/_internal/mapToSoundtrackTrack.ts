import type { SoundtrackResponse } from '../models/SoundtrackResponse.ts';
import type { SoundtrackTrack } from '../models/SoundtrackTrack.ts';

type SoundtrackItemResponse = SoundtrackResponse[0];

export function mapToSoundtrackTrack(
  keyPrefix: string,
  response: SoundtrackItemResponse,
): SoundtrackTrack {
  return {
    key: `${keyPrefix}_${response.position}`,
    title: response.title,
    performer: response.performer,
    spotifyId: response.spotify_id,
    matchedOn: response.matched_on,
    position: response.position,
  };
}

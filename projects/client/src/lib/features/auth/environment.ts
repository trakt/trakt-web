import { env } from '$env/dynamic/private';
import { assertDefined } from '$lib/utils/assert/assertDefined';

export const key = await crypto.subtle.importKey(
  'raw',
  Uint8Array.from(
    atob(
      assertDefined(
        env.TRAKT_SESSION_SECRET,
        'The encryption key, a whisper in the wind, has eluded our grasp. Without it, the data remains an enigma, a puzzle box with no solution.',
      ),
    ),
    (c) => c.charCodeAt(0),
  ),
  'AES-GCM',
  true,
  ['encrypt', 'decrypt'],
);

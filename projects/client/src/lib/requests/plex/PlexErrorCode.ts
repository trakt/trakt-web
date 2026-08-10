import { z } from 'zod';

export const PlexErrorCodeSchema = z.enum([
  'missing_token',
  'bad_auth',
  'missing_server_id',
  'plex_unprocessable',
  'invalid_server_id',
  'plex_not_found',
  'invalid_server_url',
  'plex_timeout',
  'plex_bad_response',
  'plex_generic_error',
  'unknown',
]);

export type PlexErrorCode = z.infer<typeof PlexErrorCodeSchema>;

import * as m from '$lib/features/i18n/messages.ts';
import type { PlexErrorCode } from '$lib/requests/plex/PlexErrorCode.ts';
import type { SyncLoadErrorProps } from '../SyncLoadErrorProps.ts';

export function toPlexErrorCopy(
  code: PlexErrorCode | undefined,
): SyncLoadErrorProps {
  switch (code) {
    case 'missing_token':
    case 'bad_auth':
      return {
        message: m.error_text_plex_bad_auth(),
        hint: m.error_text_plex_bad_auth_hint(),
      };
    case 'missing_server_id':
      return {
        message: m.error_text_plex_no_server_selected(),
        hint: m.error_text_plex_no_server_selected_hint(),
      };
    case 'invalid_server_id':
      return {
        message: m.error_text_plex_server_missing(),
        hint: m.error_text_plex_server_missing_hint(),
      };
    case 'plex_not_found':
      return {
        message: m.error_text_plex_not_found(),
        hint: m.error_text_plex_not_found_hint(),
      };
    case 'invalid_server_url':
      return {
        message: m.error_text_plex_server_unreachable(),
        hint: m.error_text_plex_server_unreachable_hint(),
      };
    case 'plex_timeout':
      return {
        message: m.error_text_plex_server_timeout(),
        hint: m.error_text_plex_server_timeout_hint(),
      };
    case 'plex_unprocessable':
      return {
        message: m.error_text_plex_rejected(),
        hint: m.error_text_plex_rejected_hint(),
      };
    case 'plex_bad_response':
    case 'plex_generic_error':
      return {
        message: m.error_text_plex_unavailable(),
        hint: m.error_text_plex_unavailable_hint(),
      };
    default:
      return {};
  }
}

import * as m from '$lib/features/i18n/messages.ts';

const ERROR_TEXT: Record<string, () => string> = {
  invalid_server_url: m.error_text_jellyfin_invalid_server_url,
  unsupported_scheme: m.error_text_jellyfin_unsupported_scheme,
  raw_ip_address: m.error_text_jellyfin_raw_ip_address,
  unsupported_port: m.error_text_jellyfin_unsupported_port,
  embedded_credentials: m.error_text_jellyfin_embedded_credentials,
  server_not_found: m.error_text_jellyfin_server_not_found,
  server_unreachable: m.error_text_jellyfin_server_unreachable,
  invalid_credentials: m.error_text_jellyfin_invalid_credentials,
  provider_rejected_credentials: m.error_text_jellyfin_invalid_credentials,
  quick_connect_disabled: m.error_text_jellyfin_quick_connect_disabled,
  vip_required: m.error_text_jellyfin_vip_required,
  server_limit_reached: m.error_text_jellyfin_server_limit,
  connection_removing: m.error_text_media_sync_server_removing,
};

export function toJellyfinErrorText(error: string): string {
  return Object.hasOwn(ERROR_TEXT, error)
    ? ERROR_TEXT[error]()
    : m.error_text_media_sync_generic();
}

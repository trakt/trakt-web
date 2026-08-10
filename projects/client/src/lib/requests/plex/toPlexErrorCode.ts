// The API wraps per-user plex failures in {error_code, message, guidance};
// dig the code out of a FetchError's response so callers can pick copy.
export function toPlexErrorCode(error: unknown): string | undefined {
  const response = (error as { response?: unknown })?.response;
  const single = Array.isArray(response) ? response.at(0) : response;
  const body = (single as { body?: unknown })?.body;
  const code = (body as { error_code?: unknown })?.error_code;
  return typeof code === 'string' ? code : undefined;
}

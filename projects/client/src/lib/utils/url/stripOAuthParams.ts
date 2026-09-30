const OAUTH_PARAMS = ['code', 'state'] as const;

export function stripOAuthParams(url: URL): URL {
  const sanitized = new URL(url);
  OAUTH_PARAMS.forEach((param) => sanitized.searchParams.delete(param));
  return sanitized;
}

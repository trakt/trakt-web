export function authHeader() {
  return {
    Authorization: `Bearer ${TRAKT_BEARER_TOKEN}`,
  };
}

const REPUTABLE_HOSTS = [
  'imdb.com',
  'themoviedb.org',
  'rottentomatoes.com',
  'letterboxd.com',
  'thetvdb.com',
  'metacritic.com',
  'wikipedia.org',
] as const;

const isHostOrSubdomain = (hostname: string, host: string): boolean =>
  hostname === host || hostname.endsWith(`.${host}`);

const toUrl = (value: string): URL | null => {
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
};

export function isReputableLink(value: string): boolean {
  const url = toUrl(value);
  if (!url) return false;
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;

  const hostname = url.hostname.toLowerCase();
  return REPUTABLE_HOSTS.some((host) => isHostOrSubdomain(hostname, host));
}

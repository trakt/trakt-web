import type { MetaInfoProps } from '$lib/sections/summary/components/media/useMediaMetaInfo.ts';

const PLEX_BASE_URL = 'https://watch.plex.tv';

export function buildPlexLink(target: MetaInfoProps): HttpsUrl {
  const type = target.type === 'episode' ? 'show' : target.type;

  const plexUrl: HttpsUrl = `${PLEX_BASE_URL}/${type}/${target.media.plexSlug}`;

  return target.type === 'episode'
    ? `${plexUrl}/season/${target.episode.season}/episode/${target.episode.number}`
    : plexUrl;
}

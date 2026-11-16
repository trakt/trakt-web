import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterTarget } from '../models/LivingPosterTarget.ts';
import { parseLivingPoster } from './parseLivingPoster.ts';

const MEDIA_HOST = 'https://media.trakt.tv';

const posters = new Map<string, Promise<LivingPoster | null>>();

const folder = (type: LivingPosterTarget['type']) =>
  type === 'movie' ? 'movies' : 'shows';

function requestLivingPoster(baseUrl: string) {
  return fetch(`${baseUrl}/live.json`)
    .then((response) => (response.ok ? response.json() : null))
    .then((raw) => parseLivingPoster({ raw, baseUrl }))
    .catch(() => null);
}

export function fetchLivingPoster({ type, id }: LivingPosterTarget) {
  const baseUrl = `${MEDIA_HOST}/${folder(type)}/${id}/live`;
  const cached = posters.get(baseUrl) ?? requestLivingPoster(baseUrl);
  posters.set(baseUrl, cached);

  return cached;
}

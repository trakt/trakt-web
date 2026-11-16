import { browser } from '$app/environment';
import type { LivingPosterIndex } from '../models/LivingPosterIndex.ts';
import { parseLivingPosterIndex } from './parseLivingPosterIndex.ts';

const INDEX_URL = 'https://media.trakt.tv/live/index.json';

let index: Promise<LivingPosterIndex | null> | null = null;

const requestIndex = () =>
  fetch(INDEX_URL)
    .then((response) => (response.ok ? response.json() : null))
    .then(parseLivingPosterIndex)
    .catch(() => null);

export function fetchLivingPosterIndex() {
  if (!browser) return Promise.resolve(null);

  index ??= requestIndex();

  return index;
}

import { IS_DEV, IS_PREVIEW } from '../env/index.ts';

export function getReferrer() {
  if (IS_DEV) {
    return 'http://localhost:5173';
  }

  if (IS_PREVIEW) {
    return 'http://localhost:4173';
  }

  return 'https://app.trakt.tv';
}

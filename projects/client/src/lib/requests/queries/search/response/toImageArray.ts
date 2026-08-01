import { mediumUrl } from '$lib/requests/_internal/mediumUrl.ts';
import { prependStorageHost } from './prependStorageHost.ts';

export const toImageArray = (url: string | Nil) => {
  return url == null ? [] : [prependStorageHost(mediumUrl(url), '.webp')];
};

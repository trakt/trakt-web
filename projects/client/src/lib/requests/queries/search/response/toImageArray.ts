import { mediumUrl } from './mediumUrl.ts';
import { prependStorageHost } from './prependStorageHost.ts';

export const toImageArray = (url: string | Nil) => {
  return url == null ? [] : [prependStorageHost(mediumUrl(url), '.webp')];
};

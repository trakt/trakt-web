import type { EpisodeIntl } from './EpisodeIntl';

export type MediaIntl = EpisodeIntl & {
  tagline: string | Nil;
};

import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import type { EpisodeIntl } from '$lib/requests/models/EpisodeIntl.ts';
import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

type FallbackIntl = {
  title: string;
  overview: string;
};

type ToMediaIntlProps = {
  type: MediaType;
  translations?: Array<MediaIntl>;
  fallback?: FallbackIntl & { tagline: string };
};

type ToEpisodeIntlProps = {
  type: 'episode';
  translations?: Array<EpisodeIntl>;
  fallback?: FallbackIntl;
};

type ToMediaOrEpisodeIntlProps = ToMediaIntlProps | ToEpisodeIntlProps;

export function findRegionalIntl(props: ToMediaOrEpisodeIntlProps) {
  const { region } = getLanguageAndRegion();

  const commonIntl = (intl?: MediaIntl | EpisodeIntl) => ({
    title: intl?.title ?? props.fallback?.title ?? '',
    overview: intl?.overview ?? props.fallback?.overview ?? '',
    country: intl?.country ?? '',
  });

  if (props.type === 'episode') {
    const intl = props.translations?.find((intl) => intl.country === region);
    return commonIntl(intl);
  }

  const intl = props.translations?.find((intl) => intl.country === region);
  return {
    ...commonIntl(intl),
    tagline: intl?.tagline ?? props.fallback?.tagline ?? '',
  };
}

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

function pickField<T extends MediaIntl | EpisodeIntl>(
  translations: ReadonlyArray<T> | undefined,
  language: string,
  regionCode: string,
  getter: (intl: T) => string | Nil,
): string | undefined {
  if (!translations?.length) return undefined;

  // 1. Region match wins when it carries a non-empty value.
  const regional = translations.find((intl) => intl.country === regionCode);
  const regionalValue = regional ? getter(regional) : null;
  if (regionalValue) return regionalValue;

  // 2. Fall back to a sibling translation in the same language that
  //    does carry the field. Trakt sometimes returns the regional
  //    variant with title null while another country in the same
  //    language has it filled (e.g. es-ES null but es-MX present).
  for (const intl of translations) {
    if (intl.language !== language) continue;
    const value = getter(intl);
    if (value) return value;
  }

  return undefined;
}

export function findRegionalIntl(props: ToMediaOrEpisodeIntlProps) {
  const { language, region } = getLanguageAndRegion();
  const regionCode = region.toLowerCase();
  const languageCode = language.toLowerCase();

  const title = pickField(
    props.translations,
    languageCode,
    regionCode,
    (intl) => intl.title,
  );
  const overview = pickField(
    props.translations,
    languageCode,
    regionCode,
    (intl) => intl.overview,
  );
  const matchedCountry =
    props.translations?.find((intl) => intl.country === regionCode)?.country ??
      '';

  const common = {
    title: title ?? props.fallback?.title ?? '',
    overview: overview ?? props.fallback?.overview ?? '',
    country: matchedCountry,
  };

  if (props.type === 'episode') {
    return common;
  }

  const tagline = pickField(
    props.translations,
    languageCode,
    regionCode,
    (intl) => intl.tagline,
  );

  return {
    ...common,
    tagline: tagline ?? props.fallback?.tagline ?? '',
  };
}

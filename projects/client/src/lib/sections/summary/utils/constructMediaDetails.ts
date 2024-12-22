import type { GenreIntl } from '$lib/components/summary/GenreIntl.ts';
import { GenreIntlProvider } from '$lib/components/summary/GenreIntlProvider.ts';
import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { MediaStudio } from '$lib/models/MediaStudio.ts';
import type { MediaSummary } from '$lib/requests/models/MediaSummary.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';

type MediaDetail = {
  title: string;
  values?: string[];
};

type ConstructMediaDetailsProps = {
  media: MediaSummary;
  studios: MediaStudio[];
  i18n?: GenreIntl;
};

export function constructMediaDetails({
  media,
  studios,
  i18n = GenreIntlProvider,
}: ConstructMediaDetailsProps): MediaDetail[] {
  const genres = media.genres.map(i18n.genre);
  const studioNames = studios.map((studio) => studio.name);

  const languages = media.languages?.map((language) =>
    toLanguageName(language, languageTag())
  );

  return [
    {
      title: m.premiered(),
      values: [toHumanDay(media.airedDate, getLocale())],
    },
    {
      title: m.runtime(),
      values: [toHumanDuration({ minutes: media.runtime }, languageTag())],
    },
    {
      title: m.country(),
      values: media.country
        ? [toCountryName(media.country, languageTag())]
        : undefined,
    },
    {
      title: m.language(),
      values: languages,
    },
    {
      title: m.studio(),
      values: studioNames,
    },
    {
      title: m.genre(),
      values: genres,
    },
  ];
}

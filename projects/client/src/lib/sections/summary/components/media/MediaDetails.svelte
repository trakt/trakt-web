<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import type { CrewMember, MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName";
  import { toLanguageName } from "$lib/utils/formatting/intl/toLanguageName";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import CollapsableValues from "./_internal/CollapsableValues.svelte";
  import DetailsGrid from "./_internal/DetailsGrid.svelte";

  export type MediaDetailsProps = {
    media: MediaEntry;
    studios: MediaStudio[];
    crew: MediaCrew;
  };

  const { media, studios, crew }: MediaDetailsProps = $props();

  /*TODO:
    -Differentiate between Show and Movie
  */

  const genres = media.genres.map(GenreIntlProvider.genre);
  const studioNames = studios.map((studio) => studio.name);

  const languages = media.languages?.map((language) =>
    toLanguageName(language, languageTag()),
  );

  const toCrewMemberWithJob = (person: CrewMember) => {
    const jobs = person.jobs.map((job) => toTranslatedValue("job", job));
    return `${person.name} (${jobs.join(", ")})`;
  };

  const mainItemDetail = () => {
    if (media.year) {
      const isUpcomingItem = media.airDate > new Date();
      return {
        title: isUpcomingItem ? m.expected_premiere() : m.premiered(),
        values: [toHumanDay(media.airDate, getLocale())],
      };
    }

    return {
      title: m.status(),
      values: [toTranslatedValue("status", media.status)],
    };
  };

  const mediaDetails = [
    mainItemDetail(),
    {
      title: m.runtime(),
      values: [toHumanDuration({ minutes: media.runtime }, languageTag())],
    },
    {
      title: m.director(),
      values: crew.directors.map(toCrewMemberWithJob),
    },
    {
      title: m.writer(),
      values: crew.writers.map(toCrewMemberWithJob),
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
</script>

<DetailsGrid title={m.details()}>
  {#each mediaDetails as { title, values }}
    {#if values && values.length > 0}
      <div>
        <p class="meta-info secondary">{title}</p>
        <CollapsableValues category={title} {values}>
          {#snippet value(value)}
            <p class="small capitalize ellipsis">{value}</p>
          {/snippet}
        </CollapsableValues>
      </div>
    {/if}
  {/each}
</DetailsGrid>

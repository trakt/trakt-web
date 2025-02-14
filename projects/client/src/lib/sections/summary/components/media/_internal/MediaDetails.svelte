<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import Link from "$lib/components/link/Link.svelte";
  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import type { CrewMember } from "$lib/requests/models/MediaCrew";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName";
  import { toLanguageName } from "$lib/utils/formatting/intl/toLanguageName";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CollapsableValues from "./CollapsableValues.svelte";
  import DetailsGrid from "./DetailsGrid.svelte";
  import type { MediaDetailsProps } from "./MediaDetailsProps";

  const { media, studios, crew }: MediaDetailsProps = $props();

  type MediaDetail = {
    title: string;
    values?: Array<string | { label: string; link: string }>;
  };
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
    return {
      label: `${person.name} (${jobs.join(", ")})`,
      link: UrlBuilder.people(person.id),
    };
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

  const mediaDetails: MediaDetail[] = [
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
      <CollapsableValues category={title} {values}>
        <p class="meta-info secondary">{title}</p>
        {#snippet value(value)}
          {#if typeof value === "object"}
            <Link href={value.link}>
              <p class="small capitalize ellipsis">{value.label}</p>
            </Link>
          {:else}
            <p class="small capitalize ellipsis">{value}</p>
          {/if}
        {/snippet}
      </CollapsableValues>
    {/if}
  {/each}
</DetailsGrid>

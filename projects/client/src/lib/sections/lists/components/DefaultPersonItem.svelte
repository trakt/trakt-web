<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import CelebrationIcon from "$lib/components/icons/CelebrationIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { getYearsDifference } from "$lib/utils/date/getYearsDifference";
  import { isSameDayOfYear } from "$lib/utils/date/isSameDayOfYear";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    person,
    source,
    onclick,
    variant = "default",
  }: {
    person: PersonSummary;
    source?: string;
    onclick?: (item: PersonSummary) => void;
    variant?: "default" | "birthday";
  } = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);
  const today = new Date();
</script>

<PersonCard>
  <Link
    focusable={false}
    href={UrlBuilder.people(person.slug)}
    onclick={() => {
      onclick?.(person);
      source && track({ source, type: "person" });
    }}
  >
    <CardCover
      title={person.name}
      src={person.headshot.url.thumb}
      alt={`${m.image_alt_person_headshot({ person: person.name })}`}
    />
  </Link>
  <CardFooter>
    <p class="trakt-card-title ellipsis">
      {person.name}
    </p>

    {#if variant === "default" && person.knownFor}
      {toTranslatedPosition(person.knownFor)}
    {/if}

    {#if variant === "birthday" && person.birthday}
      <div class="trakt-card-subtitle trakt-person-birthday">
        {#if isSameDayOfYear(person.birthday, today)}
          <CelebrationIcon />
        {/if}

        <p class="no-wrap ellipsis">
          {toHumanDay(person.birthday, getLocale(), "short")}
          ({getYearsDifference(person.birthday, today)})
        </p>
      </div>
    {/if}
  </CardFooter>
</PersonCard>

<style>
  .trakt-person-birthday {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(svg) {
      flex-shrink: 0;

      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>

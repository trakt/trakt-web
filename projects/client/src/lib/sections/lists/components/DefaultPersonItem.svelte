<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    person,
    subtitle,
    source,
    onclick,
  }: {
    person: PersonSummary;
    subtitle?: string;
    source?: string;
    onclick?: (item: PersonSummary) => void;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);
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
    {#if person.knownFor}
      <p class="trakt-card-subtitle ellipsis">
        {subtitle ?? toTranslatedValue("position", person.knownFor)}
      </p>
    {/if}
  </CardFooter>
</PersonCard>

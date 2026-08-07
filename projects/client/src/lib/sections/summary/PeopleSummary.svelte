<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { CrewPositions } from "$lib/requests/models/CrewPosition";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CreditsList from "../lists/CreditsList.svelte";
  import CreditsHistoryList from "../lists/history/CreditsHistoryList.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import PeopleMastheadHeader from "./components/people/PeopleMastheadHeader.svelte";
  import PeopleSummary from "./components/people/PeopleSummary.svelte";
  import PeopleSummaryV2 from "./components/people/v2/PeopleSummary.svelte";

  const {
    person,
    positions,
  }: {
    person: PersonSummary;
    positions?: CrewPositions;
  } = $props();

  const { mode } = useDiscover();
</script>

<!--
  The masthead treatment carries every width itself, so it replaces both shipped
  headers rather than only the desktop one - see MediaSummaryHeader for why the
  device split is not left in two places.
-->
<RenderForFeature flag={FeatureFlag.PeopleHeaderMasthead} audience="director">
  {#snippet enabled()}
    <PeopleMastheadHeader {person} />
  {/snippet}

  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    <PeopleSummaryV2 {person} />
  </RenderFor>

  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    <PeopleSummary {person} />
  </RenderFor>
</RenderForFeature>

{#if $mode === "media" || $mode === "movie"}
  <CreditsList
    title={m.list_title_movie_credits()}
    type="movie"
    {person}
    {positions}
    drilldownLink={UrlBuilder.credits.movies(person.slug)}
  />
{/if}

{#if $mode === "media" || $mode === "show"}
  <CreditsList
    title={m.list_title_show_credits()}
    type="show"
    {person}
    {positions}
    drilldownLink={UrlBuilder.credits.shows(person.slug)}
  />
{/if}

<CreditsHistoryList
  {person}
  drilldownLink={UrlBuilder.credits.history(person.slug)}
/>

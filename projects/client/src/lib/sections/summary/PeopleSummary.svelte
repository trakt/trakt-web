<script lang="ts">
  import { page } from "$app/state";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import AwardsDrawerHost from "./components/awards/AwardsDrawerHost.svelte";
  import PersonAwardsTimeline from "./components/awards/PersonAwardsTimeline.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { CrewPositions } from "$lib/requests/models/CrewPosition";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CreditsList from "../lists/CreditsList.svelte";
  import CreditsHistoryList from "../lists/history/CreditsHistoryList.svelte";
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
  const { drawer, close } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
  );
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <PeopleSummaryV2 {person} />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <PeopleSummary {person} />
</RenderFor>

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

<RenderForFeature flag={FeatureFlag.Awards} audience="director">
  {#snippet enabled()}
    <PersonAwardsTimeline slug={person.slug} />
  {/snippet}
</RenderForFeature>

<CreditsHistoryList
  {person}
  drilldownLink={UrlBuilder.credits.history(person.slug)}
/>

{#if drawer === SummaryDrawers.Awards}
  <RenderForFeature flag={FeatureFlag.Awards} audience="director">
    {#snippet enabled()}
      <AwardsDrawerHost
        target={{ type: "person", slug: person.slug }}
        onClose={close}
      />
    {/snippet}
  </RenderForFeature>
{/if}

<script lang="ts">
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import MediaOverview from "./MediaOverview.svelte";
  import MediaSummaryContainer from "./MediaSummaryContainer.svelte";
  import MediaSummaryHeader from "./MediaSummaryHeader.svelte";
  import MediaTitle from "./MediaTitle.svelte";

  const {
    person,
  }: {
    person: PersonSummary;
  } = $props();
</script>

<MediaSummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={person.headShotUrl} alt={person.name} />
  {/snippet}

  <MediaSummaryHeader title={person.name}>
    <MediaTitle title={person.name} />
  </MediaSummaryHeader>

  <MediaOverview title={person.name} overview={person.biography} />
</MediaSummaryContainer>

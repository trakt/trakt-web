<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import CreditsList from "../lists/CreditsList.svelte";
  import SummaryContainer from "./components/summary/SummaryContainer.svelte";
  import SummaryHeader from "./components/summary/SummaryHeader.svelte";
  import SummaryOverview from "./components/summary/SummaryOverview.svelte";
  import SummaryTitle from "./components/summary/SummaryTitle.svelte";

  const {
    person,
  }: {
    person: PersonSummary;
  } = $props();
</script>

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={person.headShotUrl} alt={person.name} />
  {/snippet}

  <SummaryHeader>
    {#snippet headerActions()}
      <ShareButton
        title={person.name}
        textFactory={(name) => m.share_person({ name })}
      />
    {/snippet}
    <SummaryTitle title={person.name} />
  </SummaryHeader>

  <SummaryOverview title={person.name} overview={person.biography} />
</SummaryContainer>

<CreditsList title={m.movies()} type="movie" {person} />
<CreditsList title={m.shows()} type="show" {person} />

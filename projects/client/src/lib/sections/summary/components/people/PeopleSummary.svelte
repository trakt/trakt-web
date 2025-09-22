<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryHeader from "./../summary/SummaryHeader.svelte";
  import SummaryOverview from "./../summary/SummaryOverview.svelte";
  import SummaryTitle from "./../summary/SummaryTitle.svelte";

  const { person }: { person: PersonSummary } = $props();
</script>

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={person.headshot.url.medium} alt={person.name} />
  {/snippet}

  <SummaryHeader>
    {#snippet headerActions()}
      <ShareButton
        title={person.name}
        textFactory={({ title: name }) => m.text_share_person({ name })}
        source={{ id: "person" }}
      />
    {/snippet}
    <SummaryTitle title={person.name} />
  </SummaryHeader>

  <SummaryOverview title={person.name} overview={person.biography} />
</SummaryContainer>

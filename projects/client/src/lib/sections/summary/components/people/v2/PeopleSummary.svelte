<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import Summary from "./../../_internal/Summary.svelte";
  import SummaryOverview from "./../../summary/SummaryOverview.svelte";
  import PersonTitle from "./_internal/PersonTitle.svelte";

  const { person }: { person: PersonSummary } = $props();
</script>

<Summary>
  {#snippet poster()}
    <SummaryPoster src={person.headshot.url.medium} alt={person.name} />
  {/snippet}

  {#snippet sideActions()}
    <ShareButton
      title={person.name}
      textFactory={({ title: name }) => m.text_share_person({ name })}
      source={{ id: "person" }}
    />
  {/snippet}

  {#snippet meta()}
    <PersonTitle name={person.name} knownFor={person.knownFor} />
  {/snippet}

  <SummaryOverview title={person.name} overview={person.biography} />
</Summary>

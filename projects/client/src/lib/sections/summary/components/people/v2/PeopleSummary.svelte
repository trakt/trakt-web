<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import PersonTitle from "../../_internal/PersonTitle.svelte";
  import Summary from "./../../_internal/Summary.svelte";
  import SummaryOverview from "./../../summary/SummaryOverview.svelte";
  import ImdbLink from "./_internal/ImdbLink.svelte";
  import PersonDetails from "./_internal/PersonDetails.svelte";
  import SocialMediaLinks from "./_internal/SocialMediaLinks.svelte";

  const { person }: { person: PersonSummary } = $props();
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<Summary>
  {#snippet poster()}
    <SummaryPoster src={person.headshot.url.medium} alt={person.name} {tags} />
  {/snippet}

  {#snippet sideActions()}
    <ShareButton
      title={person.name}
      textFactory={({ title: name }) => m.text_share_person({ name })}
      source={{ id: "person" }}
    />
    <SocialMediaLinks {person} />
  {/snippet}

  {#snippet meta()}
    <PersonTitle name={person.name} knownFor={person.knownFor} />

    <PersonDetails
      birthday={person.birthday}
      deathDate={person.deathDate}
      height={person.height}
    />
  {/snippet}

  <SummaryOverview title={person.name} overview={person.biography} />
</Summary>

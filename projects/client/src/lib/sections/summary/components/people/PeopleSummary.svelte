<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import PersonTitle from "../_internal/PersonTitle.svelte";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryHeader from "./../summary/SummaryHeader.svelte";
  import SummaryOverview from "./../summary/SummaryOverview.svelte";
  import BirthdayDetails from "./v2/_internal/BirthdayDetails.svelte";
  import ImdbLink from "./v2/_internal/ImdbLink.svelte";
  import SocialMediaLinks from "./v2/_internal/SocialMediaLinks.svelte";

  const { person }: { person: PersonSummary } = $props();
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={person.headshot.url.medium} alt={person.name} {tags} />
  {/snippet}

  <SummaryHeader title={person.name}>
    {#snippet headerActions()}
      <ShareButton
        title={person.name}
        textFactory={({ title: name }) => m.text_share_person({ name })}
        source={{ id: "person" }}
      />
    {/snippet}

    <PersonTitle name={person.name} knownFor={person.knownFor} />
  </SummaryHeader>

  <SummaryOverview title={person.name} overview={person.biography} />

  <div class="person-meta-info">
    <SocialMediaLinks {person} variant="compact" />

    {#if person.birthday}
      <BirthdayDetails
        birthday={person.birthday}
        deathDate={person.deathDate}
        variant="compact"
      />
    {/if}
  </div>
</SummaryContainer>

<style>
  .person-meta-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-l);
  }
</style>

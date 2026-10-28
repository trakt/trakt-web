<script lang="ts">
  import ListHeader from "$lib/components/lists/ListHeader.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { slide } from "svelte/transition";
  import TriviaSummaryCard from "./_internal/TriviaSummaryCard.svelte";
  import TriviaUpsell from "./_internal/TriviaUpsell.svelte";
  import { useTrivia } from "./useTrivia";

  const { media }: { media: MediaEntry } = $props();

  const maxFacts = 3;

  const { summary } = $derived(
    useTrivia({
      slug: media.slug,
      type: media.type,
      variant: "no-spoilers",
    }),
  );

  const visibleFacts = $derived($summary.slice(0, maxFacts));
</script>

{#if visibleFacts.length > 0}
  <section class="trakt-trivia-section" transition:slide={{ duration: 150 }}>
    <ListHeader title={m.list_title_trivia()} />
    <div class="trakt-trivia-section-body">
      <TriviaSummaryCard summary={visibleFacts} />
    </div>
  </section>
{:else}
  <!-- No facts is not the same as no feature: the endpoint returns nothing to
       a free member, so the section would silently vanish and the trivia
       upsell in the drawer would never be reachable. `TriviaUpsell` gates
       itself to the audiences that get an empty list for tier reasons. -->
  <TriviaUpsell />
{/if}

<style>
  .trakt-trivia-section {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);
  }

  .trakt-trivia-section-body {
    padding-inline: var(--layout-distance-side);
  }
</style>

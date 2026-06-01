<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { slide } from "svelte/transition";
  import TriviaSummaryCard from "./_internal/TriviaSummaryCard.svelte";
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
    <h2 class="trakt-trivia-section-title">{m.list_title_trivia()}</h2>
    <TriviaSummaryCard summary={visibleFacts} />
  </section>
{/if}

<style>
  .trakt-trivia-section {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);

    padding-inline: var(--layout-distance-side);
  }

  .trakt-trivia-section-title {
    margin: 0;
  }
</style>

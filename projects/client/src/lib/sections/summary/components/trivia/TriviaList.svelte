<script lang="ts">
  import ListHeader from "$lib/components/lists/ListHeader.svelte";
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
    <ListHeader title={m.list_title_trivia()} />
    <div class="trakt-trivia-section-body">
      <TriviaSummaryCard summary={visibleFacts} />
    </div>
  </section>
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

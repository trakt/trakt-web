<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { slide } from "svelte/transition";
  import TriviaCard from "./_internal/TriviaCard.svelte";
  import { useTrivia } from "./useTrivia";

  const { media }: { media: MediaEntry } = $props();

  const maxLines = 6;
  const lineWidth = 70;

  const { summary } = $derived(
    useTrivia({
      slug: media.slug,
      type: media.type,
      variant: "no-spoilers",
    }),
  );

  const summaryItem = $derived.by(() => {
    const items: string[] = [];
    let lines = 0;

    for (const item of $summary) {
      const itemLines = item.length > lineWidth ? 2 : 1;
      if (lines + itemLines > maxLines) break;
      items.push(`- ${item}`);
      lines += itemLines;
    }

    return {
      key: `${media.type}_trivia_summary`,
      isSpoiler: false,
      text: items.join("\n"),
    };
  });
</script>

{#if summaryItem.text.length > 0}
  <div class="trivia-list-container" transition:slide={{ duration: 150 }}>
    <SectionList
      id={`trivia-list-${media.slug}-${media.type}`}
      items={[summaryItem]}
      title={m.list_title_trivia()}
      --height-list="var(--height-trivia-list)"
    >
      {#snippet item(trivia)}
        <TriviaCard {trivia} {media} variant="summary" />
      {/snippet}
    </SectionList>
  </div>
{/if}

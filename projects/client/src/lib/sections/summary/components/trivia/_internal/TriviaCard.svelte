<script lang="ts">
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import { Marked } from "marked";
  import InfoCard from "../../_internal/InfoCard.svelte";

  const {
    trivia,
    media,
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
  } = $props();

  const marked = new Marked();
</script>

{#snippet parsedContent()}
  {@html marked.parse(trivia.text)}
{/snippet}

<InfoCard>
  {#if !trivia.isSpoiler}
    {@render parsedContent()}
  {:else}
    <Spoiler {media} type={media.type}>
      {@render parsedContent()}
    </Spoiler>
  {/if}
</InfoCard>

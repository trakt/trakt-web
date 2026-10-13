<script lang="ts">
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import InfoCard from "../../_internal/InfoCard.svelte";

  const {
    trivia,
    media,
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
  } = $props();
</script>

{#snippet parsedContent()}
  <p>
    <InlineMarkdown text={trivia.text} />
  </p>
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

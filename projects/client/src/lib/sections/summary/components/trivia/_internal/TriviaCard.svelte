<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import { Marked } from "marked";

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

<Card variant="transparent" --width-card="100%" --height-card="fit-content">
  <div class="trakt-trivia-container">
    {#if !trivia.isSpoiler}
      {@render parsedContent()}
    {:else}
      <Spoiler {media} type={media.type}>
        {@render parsedContent()}
      </Spoiler>
    {/if}
  </div>
</Card>

<style>
  .trakt-trivia-container {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    box-sizing: border-box;
    padding: var(--ni-20) var(--ni-24);

    background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 24%, transparent);
    border-radius: var(--border-radius-m);

    :global(.trakt-spoiler) {
      cursor: pointer;
    }

    :global(li) {
      font-size: var(--font-size-text);
    }
  }
</style>

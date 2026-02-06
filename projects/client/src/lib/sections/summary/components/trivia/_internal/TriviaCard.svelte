<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import { Marked } from "marked";
  import ShadowScroller from "./ShadowScroller.svelte";

  const { trivia, media }: { trivia: MediaTrivia; media: MediaEntry } =
    $props();

  const marked = new Marked();
</script>

{#snippet content()}
  {@html marked.parse(trivia.text)}
{/snippet}

<Card
  --width-card="var(--width-trivia-card)"
  --height-card="var(--height-trivia-card)"
>
  <div class="trakt-trivia-container">
    <ShadowScroller>
      {#if !trivia.isSpoiler}
        {@render content()}
      {:else}
        <Spoiler {media} type={media.type}>
          {@render content()}
        </Spoiler>
      {/if}
    </ShadowScroller>
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-trivia-container {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    justify-content: space-between;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }

    :global(li) {
      font-size: var(--font-size-text);
    }
  }
</style>

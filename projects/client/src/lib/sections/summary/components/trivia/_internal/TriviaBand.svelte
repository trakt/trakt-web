<script lang="ts">
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";

  /*
    One fact as a quiet band: the purple sparkle the header's trivia token
    wears beside the text, no frame. The category is named once above its
    group by the list, not on every fact. Spoiler-flagged facts keep their
    blur.
  */
  const {
    trivia,
    media,
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
  } = $props();
</script>

{#snippet parsedContent()}
  <p><InlineMarkdown text={trivia.text} /></p>
{/snippet}

<div class="trakt-trivia-band">
  <span class="trivia-mark" aria-hidden="true"><SparkleIcon /></span>

  <div class="trivia-text">
    {#if !trivia.isSpoiler}
      {@render parsedContent()}
    {:else}
      <Spoiler {media} type={media.type}>
        {@render parsedContent()}
      </Spoiler>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-trivia-band {
    --trivia-line-height: 1.6;

    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);

    font-size: var(--font-size-text);
  }

  .trivia-mark {
    display: inline-flex;
    align-items: center;
    flex: none;

    /* Exactly one line of the fact tall, so the sparkle centres on it. */
    height: calc(var(--font-size-text) * var(--trivia-line-height));

    color: var(--purple-300);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .trivia-text {
    min-width: 0;

    color: var(--color-text-primary);
    line-height: var(--trivia-line-height);

    :global(p) {
      margin: 0;
    }
  }
</style>

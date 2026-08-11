<script lang="ts">
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import { Marked } from "marked";

  /*
    One fact as a quiet band: the purple sparkle the header's trivia token
    wears, the category in caps above the text, no frame - the hairline
    between neighbours is the list's job. Spoiler-flagged facts keep their
    blur.
  */
  const {
    trivia,
    media,
    categoryLabel,
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
    categoryLabel: string;
  } = $props();

  const marked = new Marked();
</script>

{#snippet parsedContent()}
  {@html marked.parse(trivia.text)}
{/snippet}

<div class="trakt-trivia-card">
  <span class="trivia-mark" aria-hidden="true"><SparkleIcon /></span>

  <div class="trivia-body">
    <p class="trivia-category">{categoryLabel}</p>
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
</div>

<style lang="scss">
  .trakt-trivia-card {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);

    font-size: var(--font-size-text);
  }

  .trivia-mark {
    display: inline-flex;
    align-items: center;

    /* Spans the category line's height, so the sparkle centres on it. */
    height: calc(var(--font-size-tag) * 1.6);

    color: var(--purple-300);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .trivia-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    min-width: 0;
  }

  .trivia-category {
    margin: 0;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .trivia-text {
    color: var(--color-text-secondary);
    line-height: 1.6;

    :global(p) {
      margin: 0;
    }
  }
</style>

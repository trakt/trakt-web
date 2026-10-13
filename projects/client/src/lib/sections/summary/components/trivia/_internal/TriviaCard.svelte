<script lang="ts">
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import { createSafeMarked } from "$lib/utils/markdown/createSafeMarked.ts";
  import InfoCard from "../../_internal/InfoCard.svelte";

  const {
    trivia,
    media,
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
  } = $props();

  const marked = createSafeMarked();
</script>

{#snippet parsedContent()}
  <div class="trakt-trivia-text">
    {@html marked.parse(trivia.text)}
  </div>
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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-trivia-text {
    display: contents;

    :global(a) {
      @include default-link-style;

      text-underline-offset: var(--ni-2);
      text-decoration-thickness: var(--ni-2);
    }
  }
</style>

<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";

  const POSTER_LIMIT = 5;

  const { posters }: { posters: MediaListSummary["posters"] } = $props();

  const visiblePosters = $derived(posters.slice(0, POSTER_LIMIT));
</script>

<div class="trakt-nudge-list-posters" aria-hidden="true">
  {#each visiblePosters as poster, index (index)}
    <div class="nudge-list-poster" style="--poster-index: {index}">
      <CrossOriginImage src={poster.url.thumb} alt="" />
    </div>
  {:else}
    <div class="nudge-list-poster is-placeholder"></div>
  {/each}
</div>

<style lang="scss">
  .trakt-nudge-list-posters {
    --poster-width: var(--ni-48);
    --poster-height: var(--ni-72);
    --poster-step: var(--ni-20);

    flex-shrink: 0;

    position: relative;

    width: calc(var(--poster-width) + var(--poster-step) * 4);
    height: var(--poster-height);
  }

  .nudge-list-poster {
    --poster-index: 0;

    position: absolute;
    inset-inline-start: calc(var(--poster-step) * var(--poster-index));

    width: var(--poster-width);
    height: var(--poster-height);

    border-radius: var(--border-radius-s);
    box-shadow: var(--shadow-floating);
    overflow: hidden;

    &.is-placeholder {
      background: var(--color-background-default);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>

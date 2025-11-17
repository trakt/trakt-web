<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const { mediaType }: { mediaType: MediaType } = $props();
</script>

<div class="trakt-media-icon-tag">
  {#if mediaType === "movie"}
    <MovieIcon />
  {:else}
    <ShowIcon />
  {/if}
</div>

<style>
  .trakt-media-icon-tag {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    color: var(--color-text-primary);
    font-size: var(--font-size-text);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>

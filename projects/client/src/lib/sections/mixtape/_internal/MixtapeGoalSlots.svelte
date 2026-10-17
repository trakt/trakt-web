<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";

  const {
    round,
    total,
  }: { round: ReadonlyArray<MovieEntry | ShowEntry>; total: number } =
    $props();
</script>

<ol class="trakt-mixtape-goal-slots" aria-hidden="true">
  {#each Array.from({ length: total }, (_, index) => index) as index (index)}
    {@const keptMedia = round.at(index)}
    <li
      class="goal-slot"
      class:is-kept={keptMedia != null}
      class:is-next={index === round.length}
    >
      {#if keptMedia}
        <CrossOriginImage src={keptMedia.poster.url.thumb} alt="" />
      {:else}
        <BookmarkIcon state="missing" />
      {/if}
    </li>
  {/each}
</ol>

<style lang="scss">
  .trakt-mixtape-goal-slots {
    display: flex;
    gap: var(--ni-6);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .goal-slot {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    width: var(--width-mixtape-goal-slot, var(--ni-30));
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border: var(--border-thickness-xs) dashed
      color-mix(in srgb, var(--purple-400) 70%, transparent);
    border-radius: var(--border-radius-xs);
    color: color-mix(in srgb, var(--purple-300) 80%, transparent);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.is-next {
      border-color: var(--purple-300);
      box-shadow: 0 0 0 var(--ni-3)
        color-mix(in srgb, var(--purple-500) 35%, transparent);
    }

    &.is-kept {
      border-style: solid;
      border-color: var(--purple-400);
    }
  }
</style>

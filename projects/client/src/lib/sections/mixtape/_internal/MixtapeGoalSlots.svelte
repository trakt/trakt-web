<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";

  const {
    round,
    total,
  }: { round: ReadonlyArray<MovieEntry | ShowEntry>; total: number } = $props();
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
    width: var(--width-mixtape-goal-slot, var(--ni-28));
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 16%, transparent);
    transform: scale(0.92);

    transition:
      transform calc(3 * var(--transition-increment))
        cubic-bezier(0.34, 1.5, 0.5, 1),
      box-shadow calc(2 * var(--transition-increment)) ease-in-out;

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.is-next {
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 40%, transparent);
    }

    &.is-kept {
      box-shadow: 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 30%, transparent);
      transform: none;
    }
  }
</style>

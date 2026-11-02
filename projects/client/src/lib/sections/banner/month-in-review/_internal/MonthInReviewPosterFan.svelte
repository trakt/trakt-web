<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MonthInReviewPoster } from "./MonthInReviewPoster.ts";

  const SKELETON_COUNT = 3;

  const {
    posters,
    shape,
  }: {
    posters: ReadonlyArray<MonthInReviewPoster> | null;
    shape: "round" | "poster";
  } = $props();

  const count = $derived(posters?.length ?? SKELETON_COUNT);
</script>

{#if count > 0}
  <div
    class="trakt-month-in-review-poster-fan"
    data-shape={shape}
    style:--fan-count={count}
    aria-hidden="true"
  >
    {#if posters}
      {#each posters as poster, index (poster.key)}
        <div class="fan-item" style:--fan-index={index}>
          <CrossOriginImage src={poster.src} alt="" />
        </div>
      {/each}
    {:else}
      {#each { length: SKELETON_COUNT }, index (index)}
        <div class="fan-item" style:--fan-index={index}>
          <Skeleton height="100%" radius="0" />
        </div>
      {/each}
    {/if}
  </div>
{/if}

<style lang="scss">
  .trakt-month-in-review-poster-fan {
    --fan-ring: var(--border-thickness-xs);
    --fan-ring-color: var(--color-background);
    --fan-ease: cubic-bezier(0.34, 1.4, 0.5, 1);
    --fan-duration: calc(2 * var(--transition-increment));

    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    width: calc(
      var(--fan-item-width) + 2 * var(--fan-ring) + (var(--fan-count) - 1) *
        var(--fan-step)
    );
    height: calc(var(--fan-item-height) + 2 * var(--fan-ring));

    transition: width var(--fan-duration) var(--fan-ease);

    &[data-shape="round"] {
      --fan-item-width: var(--ni-22);
      --fan-item-height: var(--ni-22);
      --fan-item-radius: 50%;
      --fan-step: var(--poster-fan-step, var(--ni-10));
      --fan-tilt: var(--poster-fan-tilt, 0deg);
    }

    &[data-shape="poster"] {
      --fan-item-width: var(--ni-24);
      --fan-item-height: var(--ni-36);
      --fan-item-radius: var(--border-radius-xs);
      --fan-ring: var(--border-thickness-xxs);
      --fan-step: var(--poster-fan-step, var(--ni-18));
      --fan-tilt: var(--poster-fan-tilt, 8deg);
    }
  }

  .fan-item {
    position: absolute;
    top: 0;
    inset-inline-start: calc(var(--fan-index) * var(--fan-step));

    box-sizing: border-box;
    width: calc(var(--fan-item-width) + 2 * var(--fan-ring));
    height: calc(var(--fan-item-height) + 2 * var(--fan-ring));
    overflow: hidden;

    border: var(--fan-ring) solid var(--fan-ring-color);
    border-radius: var(--fan-item-radius);
    background: var(--fan-ring-color);

    transform: rotate(
      calc(
        var(--rtl-sign) * (var(--fan-index) - (var(--fan-count) - 1) / 2) *
          var(--fan-tilt)
      )
    );
    transform-origin: 50% 100%;

    transition:
      inset-inline-start var(--fan-duration) var(--fan-ease),
      transform var(--fan-duration) var(--fan-ease);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>

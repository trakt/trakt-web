<script lang="ts">
  import Crossfade from "$lib/components/Crossfade.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import SkeletonCard from "$lib/sections/lists/components/SkeletonCard.svelte";
  import { RANDOM_ITEM_COUNT, useTrendingItems } from "../useTrendingItems";

  const { type, children }: { type: MediaType } & ChildrenProps = $props();

  const { list } = $derived(useTrendingItems(type));

  function isOddColumn(index: number): boolean {
    return Math.floor(index / 2) % 2 === 0;
  }
</script>

<div class="trakt-landing-items">
  <div class="trakt-landing-items-header">
    {@render children()}
  </div>

  <Crossfade showA={$list.length > 0}>
    {#snippet childrenA()}
      <div class="trakt-landing-trending-items">
        {#each $list as item, index (item.id)}
          <div
            class="trakt-item-wrapper"
            class:has-offset={!isOddColumn(index)}
          >
            <DefaultMediaItem {type} media={item} source="trending" />
          </div>
        {/each}
      </div>
    {/snippet}

    {#snippet childrenB()}
      <div class="trakt-landing-trending-items">
        {#each Array(RANDOM_ITEM_COUNT) as _, index (`skeleton_${index}`)}
          <div
            class="trakt-item-wrapper"
            class:has-offset={!isOddColumn(index)}
          >
            <SkeletonCard variant="portrait" index={0} listIndex={10} />
          </div>
        {/each}
      </div>
    {/snippet}
  </Crossfade>
</div>

<style>
  .trakt-landing-items {
    display: flex;
    flex-direction: column;

    gap: var(--gap-l);
  }

  .trakt-landing-items-header {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    :global(svg) {
      width: var(--ni-40);
      height: var(--ni-40);
      flex-shrink: 0;

      color: var(--purple-500);
    }
  }

  .trakt-landing-trending-items {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-auto-flow: column;

    justify-items: start;
    justify-content: start;

    gap: var(--gap-l);

    height: calc(2 * var(--height-portrait-card) + var(--gap-l));
  }

  .trakt-item-wrapper.has-offset {
    transform: translateY(var(--ni-32));
  }
</style>

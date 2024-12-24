<script lang="ts" generics="T extends { id: unknown }">
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { onMount, type Snippet } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { scrollTracking } from "./scrollTracking";
  import { useScrollHistory } from "./useScrollHistory";

  type SectionListProps<T> = {
    id: string;
    title: string;
    items: T[];
    item: Snippet<[T]>;
    empty?: Snippet;
    actions?: Snippet;
    scrollContainer?: Writable<HTMLDivElement>;
    scrollX?: Writable<{ left: number; right: number }>;
  };

  const {
    id,
    items,
    title,
    scrollX = writable({ left: 0, right: 0 }),
    scrollContainer = writable(),
    item,
    actions,
    empty,
  }: SectionListProps<T> = $props();
  const sideDistance = useVarToPixels("var(--layout-distance-side)");
  const windowShadowWidth = useVarToPixels("var(--ni-64)");

  const isLeftShadowVisible = $derived($scrollX.left > $sideDistance);
  const isRightShadowVisible = $derived($scrollX.right > $sideDistance);

  const leftShadowIntensity = $derived(
    ($scrollX.left - $sideDistance) / $windowShadowWidth,
  );

  const rightShadowIntensity = $derived(
    ($scrollX.right - $sideDistance) / $windowShadowWidth,
  );

  const isVisible = writable(false);
  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });

  const { readScrollState, writeScrollState, event } = useScrollHistory();

  function scrollHistory(container: HTMLDivElement) {
    onMount(() => {
      const destroySnapshot = event.on("snapshot", () => {
        writeScrollState(id, container.scrollLeft);
      });

      const destroyRestore = event.on("restore", () => {
        container.scrollLeft = readScrollState(id);
      });

      return () => {
        destroySnapshot();
        destroyRestore();
      };
    });
  }
</script>

<section
  use:whenInViewport={() => isVisible.set(true)}
  class="shadow-list-container"
>
  <div class="shadow-list-header">
    <h4 class="shadow-list-title ellipsis">{title}</h4>
    {#if actions != null}
      <div class="shadow-list-actions">
        {@render actions()}
      </div>
    {/if}
  </div>
  <div
    class="shadow-list"
    class:shadow-list-left-shadow={isLeftShadowVisible}
    class:shadow-list-right-shadow={isRightShadowVisible}
    style:--left-shadow-opacity={leftShadowIntensity}
    style:--right-shadow-opacity={rightShadowIntensity}
  >
    {#if items.length > 0}
      <div
        bind:this={$scrollContainer}
        use:scrollTracking={scrollX}
        use:scrollHistory
        class="shadow-list-horizontal-scroll"
      >
        {#each items as i (i.id)}
          {@render item(i)}
        {/each}
      </div>
    {:else if empty != null && $isMounted}
      <div class="shadow-list-empty-state">
        {@render empty()}
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .shadow-list-container,
  .shadow-list,
  .shadow-list-empty-state {
    min-height: var(--height-list);
  }

  .shadow-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
    transition: gap var(--transition-increment) ease-in-out;

    @include for-mobile {
      gap: var(--ni-16);
    }
  }

  .shadow-list-empty-state {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    justify-content: center;
    align-items: center;

    :global(> p) {
      padding: 0 var(--ni-16);
      text-align: center;
    }
  }

  .shadow-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ni-16);

    margin: 0;
    margin-left: calc(var(--ni-64) + var(--layout-distance-side));
    margin-right: var(--layout-distance-side);
    transition: margin-left calc(var(--transition-increment) * 2) ease-in-out;
  }

  .shadow-list-actions {
    display: flex;
    gap: var(--ni-4);
  }

  .shadow-list-title {
    color: var(--color-text-primary);
    transition: font-size calc(var(--transition-increment) * 2) ease-in-out;

    @include for-tablet-sm {
      font-size: var(--ni-32);
    }

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }

  .shadow-list {
    position: relative;

    &.shadow-list-left-shadow::before {
      opacity: var(--left-shadow-opacity);
    }

    &.shadow-list-right-shadow::after {
      opacity: var(--right-shadow-opacity);
    }

    &::before {
      --list-shadow-direction: to left;
      left: 0;
    }

    &::after {
      --list-shadow-direction: to right;
      right: 0;
    }

    &::before,
    &::after {
      content: "";
      z-index: 2;
      pointer-events: none;

      position: absolute;
      top: 0;

      width: var(--ni-56);
      height: calc(var(--height-list) - var(--layout-distance-scroll-card));

      opacity: 0;

      background: linear-gradient(
        var(--list-shadow-direction),
        transparent 0%,
        color-mix(in srgb, var(--color-background) 2%, transparent 98%) 5%,
        color-mix(in srgb, var(--color-background) 4%, transparent 96%) 9%,
        color-mix(in srgb, var(--color-background) 7%, transparent 93%) 13%,
        color-mix(in srgb, var(--color-background) 10%, transparent 90%) 17%,
        color-mix(in srgb, var(--color-background) 14%, transparent 86%) 20%,
        color-mix(in srgb, var(--color-background) 18%, transparent 82%) 24%,
        color-mix(in srgb, var(--color-background) 23%, transparent 77%) 29%,
        color-mix(in srgb, var(--color-background) 29%, transparent 71%) 34%,
        color-mix(in srgb, var(--color-background) 35%, transparent 65%) 40%,
        color-mix(in srgb, var(--color-background) 43%, transparent 57%) 46%,
        color-mix(in srgb, var(--color-background) 52%, transparent 48%) 54%,
        color-mix(in srgb, var(--color-background) 62%, transparent 38%) 63%,
        color-mix(in srgb, var(--color-background) 73%, transparent 27%) 74%,
        color-mix(in srgb, var(--color-background) 86%, transparent 14%) 86%,
        var(--color-background) 100%
      );
    }
  }

  .shadow-list-horizontal-scroll {
    padding: 0 var(--layout-distance-side);
    height: var(--height-list);
    display: flex;
    gap: var(--ni-8);
    overflow-x: auto;
    scroll-snap-type: x proximity;

    & > :global(:not(svelte-css-wrapper)) {
      scroll-snap-align: start;

      &:first-child,
      &:last-child {
        scroll-snap-align: end;
      }
    }

    & > :global(svelte-css-wrapper > *) {
      scroll-snap-align: start;
    }

    & > :global(svelte-css-wrapper:first-child > *),
    & > :global(svelte-css-wrapper:last-child > *) {
      scroll-snap-align: end;
    }
  }
</style>

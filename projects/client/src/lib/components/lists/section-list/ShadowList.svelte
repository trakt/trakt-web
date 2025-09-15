<script lang="ts" generics="T extends { id: unknown }">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Crossfade from "$lib/components/Crossfade.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { onMount, type Snippet } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import { useScrollHistoryAction } from "../_internal/useScrollHistoryAction";
  import type { ListProps } from "../ListProps";
  import { useCollapsedList } from "./_internal/useCollapsedList";
  import CollapseIcon from "./CollapseIcon.svelte";
  import ExpandIcon from "./ExpandIcon.svelte";
  import { scrollTracking } from "./scrollTracking";

  const EMPTY_STATE_CLASS = "shadow-list-empty-state";
  const CTA_CUT_OFF = 4;

  type SectionListProps<T> = ListProps<T> & {
    subtitle?: string;
    empty?: Snippet;
    scrollContainer?: Writable<HTMLDivElement>;
    scrollX?: Writable<{ left: number; right: number }>;
    variant?: "normal" | "centered";
    headerNavigationType?: DpadNavigationType;
  };

  const {
    id,
    items,
    title,
    subtitle,
    scrollX = writable({ left: 0, right: 0 }),
    scrollContainer = writable(),
    item,
    ctaItem,
    actions,
    badge,
    empty,
    headerNavigationType,
    variant = "normal",
  }: SectionListProps<T> = $props();
  const sideDistance = useVarToPixels("var(--layout-distance-side)");
  const windowShadowWidth = useVarToPixels("var(--ni-64)");

  const isLeftShadowVisible = $derived($scrollX.left > $sideDistance);
  const isRightShadowVisible = $derived($scrollX.right > $sideDistance);

  const isHeaderVisible = $derived(Boolean(title));

  const leftShadowIntensity = $derived(
    ($scrollX.left - $sideDistance) / $windowShadowWidth,
  );

  const rightShadowIntensity = $derived(
    ($scrollX.right - $sideDistance) / $windowShadowWidth,
  );

  const { navigation } = useNavigation();
  const isVisible = writable($navigation === "dpad");
  const isMounted = writable(false);
  const { isCollapsed, toggle } = $derived(useCollapsedList(id));

  const { scrollHistory } = useScrollHistoryAction("horizontal");

  onMount(() => {
    isMounted.set(true);
  });
</script>

{#snippet titleAction()}
  <RenderFor audience="all" navigation="default">
    <ActionButton
      onclick={toggle}
      label={$isCollapsed ? `Expand ${title} list` : `Collapse ${title} list`}
      style="ghost"
      color="default"
    >
      {#if $isCollapsed}
        <ExpandIcon />
      {:else}
        <CollapseIcon />
      {/if}
    </ActionButton>
  </RenderFor>
{/snippet}

<section
  use:whenInViewport={() => isVisible.set(true)}
  class="shadow-list-container"
  class:shadow-list-container-collapsed={$isCollapsed}
  class:shadow-list-container-mounted={$isMounted}
  class:shadow-list-container-no-header={!isHeaderVisible}
  data-dynamic-selector={`[data-dpad-navigation="${DpadNavigationType.Item}"], .${EMPTY_STATE_CLASS}:not(:empty)`}
>
  {#if $isVisible}
    {#if isHeaderVisible && title}
      <ListHeader
        {title}
        {subtitle}
        {titleAction}
        actions={$isCollapsed ? undefined : actions}
        {badge}
        inset="title"
        navigationType={headerNavigationType}
      />
    {/if}
    <div
      class="shadow-list"
      class:shadow-list-left-shadow={isLeftShadowVisible}
      class:shadow-list-right-shadow={isRightShadowVisible}
      style:--left-shadow-opacity={leftShadowIntensity}
      style:--right-shadow-opacity={rightShadowIntensity}
    >
      <Crossfade showA={items.length > 0}>
        {#snippet childrenA()}
          <div
            bind:this={$scrollContainer}
            use:scrollTracking={scrollX}
            use:scrollHistory={id}
            class="trakt-list-item-container"
            class:shadow-list-horizontal-scroll-centered={variant ===
              "centered"}
            class:shadow-list-horizontal-scroll={variant === "normal"}
            data-dpad-navigation={DpadNavigationType.List}
            data-navigation-type={$navigation}
          >
            {#each items as i (`${items.length}_${i.id}`)}
              {@render item(i)}
            {/each}

            {#if ctaItem && items.length <= CTA_CUT_OFF}
              {#key `shadow-list-${id}_cta`}
                {@render ctaItem()}
              {/key}
            {/if}
          </div>
        {/snippet}

        {#snippet childrenB()}
          {#if empty != null && $isMounted}
            <div class={EMPTY_STATE_CLASS}>
              {@render empty()}
            </div>
          {/if}
        {/snippet}
      </Crossfade>
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "../_internal/gap" as *;

  .shadow-list-container {
    --height-min-container: var(--ni-40);
    --height-container: calc(
      var(--height-list) + var(--ni-40) + var(--list-header-gap)
    );

    display: flex;
    flex-direction: column;

    gap: var(--list-header-gap);

    &.shadow-list-container-no-header {
      --height-container: var(--height-list);
      --height-min-container: 0;
      gap: 0;
    }

    &.shadow-list-container-mounted {
      transition:
        gap var(--transition-increment) ease-in-out,
        height var(--transition-increment) ease-in-out,
        min-height var(--transition-increment) ease-in-out;

      .shadow-list {
        transition:
          height var(--transition-increment) ease-in-out,
          min-height var(--transition-increment) ease-in-out;
      }
    }
  }

  .shadow-list-container {
    min-height: var(--height-container);
    height: var(--height-container);
  }

  .shadow-list,
  .shadow-list-empty-state {
    min-height: var(--height-list);
    height: var(--height-list);
  }

  .shadow-list-empty-state:not(:has(:global(.trakt-skeleton-list))) {
    width: calc(
      100dvw - var(--layout-distance-side) * 2 - var(--layout-sidebar-distance)
    );

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :global(> p) {
      padding: 0 var(--ni-16);
      text-align: center;
    }
  }

  .shadow-list {
    position: relative;
    overflow: hidden;
    &.shadow-list-left-shadow::before {
      opacity: var(--left-shadow-opacity);
    }

    &.shadow-list-right-shadow::after {
      opacity: var(--right-shadow-opacity);
    }

    &::before {
      left: calc(var(--list-shadow-width) / 2 * -1);
    }

    &::after {
      right: calc(var(--list-shadow-width) / 2 * -1);
    }

    &::before,
    &::after {
      content: "";
      z-index: var(--layer-floating);
      pointer-events: none;

      position: absolute;
      top: var(--ni-neg-16);

      width: var(--list-shadow-width);
      height: calc(var(--height-list) + var(--ni-16));

      opacity: 0;

      background: var(--list-shadow);
    }
  }

  .shadow-list-container.shadow-list-container-collapsed {
    min-height: var(--height-min-container);
    height: 0;

    overflow: hidden;

    .shadow-list {
      min-height: 0;
      height: 0;
    }
  }

  .shadow-list-horizontal-scroll-centered,
  .shadow-list-horizontal-scroll,
  :global(.trakt-skeleton-list) {
    height: var(--height-list);
    display: flex;
    overflow-x: auto;
    transition: gap var(--transition-increment) ease-in-out;
    @include adaptive-gap(gap);

    &[data-navigation-type="dpad"] {
      gap: var(--gap-xxs);
    }
  }

  .shadow-list-horizontal-scroll,
  :global(.trakt-skeleton-list) {
    scroll-snap-type: x proximity;

    & > :global(:not(svelte-css-wrapper)) {
      scroll-snap-align: start;

      @include for-mobile() {
        scroll-snap-align: unset;
      }

      &:first-child,
      &:last-child {
        scroll-snap-align: end;

        @include for-mobile() {
          scroll-snap-align: unset;
        }
      }
    }

    & > :global(svelte-css-wrapper > *) {
      scroll-snap-align: start;

      @include for-mobile() {
        scroll-snap-align: unset;
      }
    }

    & > :global(svelte-css-wrapper:first-child > *),
    & > :global(svelte-css-wrapper:last-child > *) {
      scroll-snap-align: end;

      @include for-mobile() {
        scroll-snap-align: unset;
      }
    }
  }

  .shadow-list-horizontal-scroll-centered {
    --center-offset: calc(50% - var(--item-width) / 2);

    scroll-snap-type: x mandatory;
    padding-left: var(--center-offset);
    padding-right: var(--center-offset);

    & > :global(:not(svelte-css-wrapper)),
    & > :global(svelte-css-wrapper > *) {
      scroll-snap-align: center;
    }
  }
</style>

<script lang="ts" generics="T extends { key: string }">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Crossfade from "$lib/components/Crossfade.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { onMount, type Snippet } from "svelte";
  import { writable } from "svelte/store";
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import { useScrollHistoryAction } from "../_internal/useScrollHistoryAction";
  import type { ListProps } from "../ListProps";
  import { resetScroll } from "./_internal/resetScroll";
  import { useCollapsedList } from "./_internal/useCollapsedList";
  import CollapseIcon from "./CollapseIcon.svelte";
  import ExpandIcon from "./ExpandIcon.svelte";

  const EMPTY_STATE_CLASS = "section-list-empty-state";
  const CTA_CUT_OFF = 4;

  type SectionListProps<T> = ListProps<T> & {
    id: string;
    empty?: Snippet;
    metaInfo?: Snippet;
    headerNavigationType?: DpadNavigationType;
    subtitle?: string;
  };

  const {
    id,
    items,
    title,
    item,
    ctaItem,
    empty,
    dynamicActions,
    metaInfo,
    actions: externalActions,
    badge,
    drilldownLink,
    headerNavigationType,
    subtitle,
  }: SectionListProps<T> = $props();

  const isHeaderVisible = $derived(Boolean(title));

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
  <RenderFor audience="all">
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

{#snippet actions()}
  {#if dynamicActions != null}
    {@render dynamicActions()}
  {/if}

  {#if externalActions != null}
    {@render externalActions()}
  {/if}
{/snippet}

<section
  use:whenInViewport={() => isVisible.set(true)}
  class="section-list-container"
  class:section-list-container-collapsed={$isCollapsed}
  class:section-list-container-mounted={$isMounted}
  class:section-list-container-no-header={!isHeaderVisible}
  class:section-list-has-drilldown={Boolean(drilldownLink)}
  data-dynamic-selector={`[data-dpad-navigation="${DpadNavigationType.Item}"], .${EMPTY_STATE_CLASS}:not(:empty)`}
>
  {#if $isVisible}
    {#if isHeaderVisible && title}
      <ListHeader
        {title}
        {subtitle}
        {titleAction}
        {metaInfo}
        actions={$isCollapsed ? undefined : actions}
        {badge}
        inset="title"
        navigationType={headerNavigationType}
        href={drilldownLink}
      />
    {/if}
    <div class="section-list">
      <Crossfade showA={items.length > 0}>
        {#snippet childrenA()}
          <div
            use:scrollHistory={id}
            use:resetScroll
            class="trakt-list-item-container section-list-horizontal-scroll"
            data-dpad-navigation={DpadNavigationType.List}
            data-navigation-type={$navigation}
          >
            {#each items as i (i.key)}
              {@render item(i)}
            {/each}

            {#if ctaItem && items.length <= CTA_CUT_OFF}
              {#key `section-list-${id}_cta`}
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

  .section-list-container {
    --height-min-container: var(--ni-40);
    --height-container: calc(
      var(--height-list) + var(--ni-40) + var(--list-header-gap)
    );

    contain: layout;

    display: flex;
    flex-direction: column;

    gap: var(--list-header-gap);

    &.section-list-container-no-header {
      --height-container: var(--height-list);
      --height-min-container: 0;
      gap: 0;
    }

    &.section-list-container-mounted {
      transition:
        gap var(--transition-increment) ease-in-out,
        height var(--transition-increment) ease-in-out,
        min-height var(--transition-increment) ease-in-out;

      .section-list {
        transition:
          height var(--transition-increment) ease-in-out,
          min-height var(--transition-increment) ease-in-out;
      }
    }
  }

  .section-list-container {
    min-height: var(--height-container);
    height: var(--height-container);
  }

  .section-list,
  .section-list-empty-state {
    min-height: var(--height-list);
    height: var(--height-list);
  }

  .section-list-empty-state:not(:has(:global(.trakt-skeleton-list))) {
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

  .section-list {
    position: relative;
    overflow: hidden;
  }

  .section-list-container.section-list-container-collapsed {
    min-height: var(--height-min-container);
    height: 0;

    overflow: hidden;

    .section-list {
      min-height: 0;
      height: 0;
    }
  }

  .section-list-horizontal-scroll,
  :global(.trakt-skeleton-list) {
    height: var(--height-list);
    display: flex;
    overflow-x: auto;
    transition: gap var(--transition-increment) ease-in-out;
    gap: var(--list-gap);

    &[data-navigation-type="dpad"] {
      gap: var(--gap-xxs);
    }
  }

  .section-list-container.section-list-has-drilldown {
    .section-list-horizontal-scroll {
      overflow-x: hidden;
      mask-image: linear-gradient(
        to right,
        black calc(100% - var(--layout-distance-side)),
        transparent calc(100% - var(--layout-distance-side))
      );

      @supports (-moz-appearance: none) {
        overflow-x: auto;
        mask-image: none;
      }

      @include for-tablet-sm-and-below {
        overflow-x: auto;
        mask-image: none;
      }
    }
  }

  .section-list-horizontal-scroll,
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
</style>

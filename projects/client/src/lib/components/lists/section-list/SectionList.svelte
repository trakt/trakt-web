<script lang="ts" generics="T extends { key: string }">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Crossfade from "$lib/components/Crossfade.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { writable } from "$lib/utils/store/WritableSubject";
  import { onMount, type Snippet } from "svelte";
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import { useScrollHistoryAction } from "../_internal/useScrollHistoryAction";
  import type { ListProps } from "../ListProps";
  import { resetScroll } from "./_internal/resetScroll";
  import { useCollapsedList } from "./_internal/useCollapsedList";
  import CollapseIcon from "./CollapseIcon.svelte";
  import type { ListVariant } from "./ListVariant";

  const emptyStateClass = "section-list-empty-state";
  const ctaCutOff = 4;

  type SectionListProps<T> = ListProps<T> & {
    id: string;
    empty?: Snippet;
    metaInfo?: Snippet;
    headerNavigationType?: DpadNavigationType;
    subtitle?: string;
    variant?: ListVariant;
    titleAction?: Snippet;
    classList?: string;
  };

  const {
    id,
    items,
    title,
    item,
    ctaItem,
    empty,
    metaInfo,
    actions,
    drilldownLink,
    noscroll,
    headerNavigationType,
    subtitle,
    variant = "default",
    titleAction: externalTitleAction,
    classList = "",
  }: SectionListProps<T> = $props();

  const isHeaderVisible = $derived(Boolean(title));

  const { navigation } = useNavigation();
  const isVisible = writable($navigation === "dpad");
  const isMounted = writable(false);
  const { isCollapsed: isListCollapsed, toggle } = $derived(
    useCollapsedList(id),
  );

  const { scrollHistory } = useScrollHistoryAction("horizontal");

  onMount(() => {
    isMounted.set(true);
  });

  const isCollapsed = $derived.by(() => {
    if (variant !== "default") {
      return false;
    }

    return $isListCollapsed;
  });
</script>

{#snippet titleAction()}
  {#if externalTitleAction}
    {@render externalTitleAction()}
  {:else if variant === "default"}
    <ActionButton
      onclick={toggle}
      label={isCollapsed ? `Expand ${title} list` : `Collapse ${title} list`}
      style="ghost"
      color="default"
    >
      <CollapseIcon state={isCollapsed ? "collapsed" : "expanded"} />
    </ActionButton>
  {/if}
{/snippet}

<section
  use:whenInViewport={() => isVisible.set(true)}
  class="section-list-container"
  class:section-list-container-collapsed={isCollapsed}
  class:section-list-container-mounted={$isMounted}
  class:section-list-container-no-header={!isHeaderVisible}
  class:section-list-has-drilldown={Boolean(drilldownLink)}
  class:section-list-has-multiple-items={items.length > 1}
  data-dynamic-selector={`[data-dpad-navigation="${DpadNavigationType.Item}"], .${emptyStateClass}:not(:empty)`}
  data-variant={variant}
  use:appendClassList={classList}
>
  {#if $isVisible}
    {#if isHeaderVisible && title}
      <ListHeader
        {title}
        {subtitle}
        {titleAction}
        {metaInfo}
        {noscroll}
        actions={isCollapsed ? undefined : actions}
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

            {#if ctaItem && items.length <= ctaCutOff}
              {#key `section-list-${id}_cta`}
                {@render ctaItem()}
              {/key}
            {/if}
          </div>
        {/snippet}

        {#snippet childrenB()}
          {#if empty != null && $isMounted}
            <div class={emptyStateClass}>
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
    --shadow-spacing: var(--ni-2);

    --height-min-container: var(--ni-40);
    --section-list-height: calc(
      var(--height-override-list, var(--height-list)) + var(--shadow-spacing)
    );
    --height-container: calc(
      var(--section-list-height) + var(--ni-40) + var(--list-header-gap)
    );

    contain: layout;

    display: flex;
    flex-direction: column;

    gap: var(--list-header-gap);

    &.section-list-container-no-header {
      --height-container: var(--section-list-height);
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

    &[data-variant="inline"] {
      :global(.trakt-list-inset-title) {
        margin: 0;
      }

      .trakt-list-item-container {
        padding-left: var(--ni-2);
        padding-right: var(--ni-2);
      }

      .section-list-empty-state {
        width: 100%;
      }
    }
  }

  .section-list-container {
    min-height: var(--height-container);
    height: var(--height-container);
  }

  .section-list,
  .section-list-empty-state {
    min-height: var(--section-list-height);
    height: var(--section-list-height);
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
    height: var(--section-list-height);
    display: flex;
    overflow-x: auto;
    transition: gap var(--transition-increment) ease-in-out;
    gap: var(--list-gap);

    padding-top: var(--shadow-spacing);

    &[data-navigation-type="dpad"] {
      gap: var(--gap-xxs);
    }
  }

  .section-list-has-multiple-items.section-list-has-drilldown,
  .section-list-has-multiple-items:has(:global(.trakt-view-all-button)) {
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

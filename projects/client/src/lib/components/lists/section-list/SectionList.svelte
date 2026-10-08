<script lang="ts" generics="T extends { key: string }">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Crossfade from "$lib/components/Crossfade.svelte";
  import "$lib/features/edit-mode/edit-mode.css";
  import EditModeVisibilityButton from "$lib/features/edit-mode/EditModeVisibilityButton.svelte";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { scrollToChild } from "$lib/utils/actions/scrollToChild.ts";
  import { touchScroll } from "$lib/utils/actions/touchScroll.ts";
  import { trackVisibleRange } from "$lib/utils/actions/trackVisibleRange.ts";
  import type { VisibleRange } from "$lib/utils/actions/VisibleRange.ts";
  import { unlockOnHorizontalWheel } from "$lib/utils/actions/unlockOnHorizontalWheel";
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
  import type { ListDrilldownProps } from "./models/ListDrilldownProps";
  import type { SectionListId } from "./models/SectionListId";

  const emptyStateClass = "section-list-empty-state";
  const ctaCutOff = 4;

  type SectionListProps<T> = Omit<ListProps<T>, "id"> & {
    id: SectionListId;
    empty?: Snippet;
    metaInfo?: Snippet;
    headerNavigationType?: DpadNavigationType;
    subtitle?: string;
    variant?: ListVariant;
    titleAction?: Snippet;
    drilldown?: ListDrilldownProps;
    contentHash?: string;
    trailingItem?: Snippet;
    /** Child index to scroll to the start of; `undefined` leaves scroll alone. */
    scrollToIndex?: number;
    /** Fires when the viewer starts scrolling the list themselves. */
    onUserScroll?: () => void;
    onVisibleRange?: (range: VisibleRange) => void;
    /** Floats over the list, e.g. labels pinned to its corners. */
    overlay?: Snippet;
  };

  const {
    id,
    items,
    title,
    item,
    ctaItem,
    trailingItem,
    empty,
    metaInfo,
    actions: _externalActions,
    drilldown,
    headerNavigationType,
    subtitle,
    variant = "default",
    titleAction: externalTitleAction,
    contentHash,
    scrollToIndex,
    onVisibleRange,
    onUserScroll,
    overlay,
  }: SectionListProps<T> = $props();

  const { isEditMode, section } = useEditMode();
  const {
    isHidden,
    toggle: toggleHidden,
    action: editModeAction,
  } = $derived(section(id.scope));

  const listId = $derived(id.key ? `${id.scope}-${id.key}` : id.scope);

  const { isEnabled } = useFeatureFlag();
  const isEditModeEnabled = $derived(isEnabled(FeatureFlag.EditMode));

  const isHeaderVisible = $derived(Boolean(title));

  const { navigation } = useNavigation();
  const isVisible = writable($navigation === "dpad");
  const isMounted = writable(false);
  const { isCollapsed: isListCollapsed, toggle } = $derived(
    useCollapsedList(listId),
  );

  const unlockKey = $derived(contentHash ?? "");
  let unlockedKey = $state<string | null>(null);
  const isHorizontalScrollUnlocked = $derived(unlockedKey === unlockKey);

  const { scrollHistory } = useScrollHistoryAction("horizontal");

  onMount(() => {
    isMounted.set(true);
  });

  const isCollapsed = $derived.by(() => {
    if (variant !== "default" || $isEditMode) {
      return false;
    }

    return $isListCollapsed;
  });
</script>

{#snippet titleAction()}
  {#if externalTitleAction}
    {@render externalTitleAction()}
  {:else if variant === "default"}
    {#if !$isEditModeEnabled}
      <ActionButton
        onclick={toggle}
        label={isCollapsed ? `Expand ${title} list` : `Collapse ${title} list`}
        style="ghost"
        color="default"
      >
        <CollapseIcon state={isCollapsed ? "collapsed" : "expanded"} />
      </ActionButton>
    {/if}
  {/if}
{/snippet}

{#snippet defaultActions()}
  {@render _externalActions?.()}
{/snippet}

{#snippet actions()}
  <RenderForFeature flag={FeatureFlag.EditMode}>
    {#snippet enabled()}
      {#if !$isEditMode}
        {@render defaultActions()}
      {:else}
        <EditModeVisibilityButton
          isHidden={$isHidden}
          label={$isHidden
            ? m.button_label_show_section({ section: title ?? "" })
            : m.button_label_hide_section({ section: title ?? "" })}
          onclick={toggleHidden}
        />
      {/if}
    {/snippet}

    {@render defaultActions()}
  </RenderForFeature>
{/snippet}

{#if !$isEditModeEnabled || $isEditMode || !$isHidden}
  <section
    use:whenInViewport={() => isVisible.set(true)}
    class="section-list-container"
    class:section-list-container-collapsed={isCollapsed}
    class:section-list-container-mounted={$isMounted}
    class:section-list-container-no-header={!isHeaderVisible}
    class:section-list-has-drilldown={Boolean(drilldown)}
    class:section-list-has-multiple-items={items.length > 1}
    data-dynamic-selector={`[data-dpad-navigation="${DpadNavigationType.Item}"], .${emptyStateClass}:not(:empty)`}
    data-variant={variant}
  >
    {#if $isVisible}
      {#if isHeaderVisible && title}
        <ListHeader
          {title}
          {subtitle}
          {titleAction}
          {metaInfo}
          actions={isCollapsed ? undefined : actions}
          navigationType={headerNavigationType}
          drilldown={isCollapsed ? undefined : drilldown}
          disabled={items.length === 0 && drilldown?.mode !== "always"}
        />
      {/if}
      <div class="section-list" use:editModeAction>
        <Crossfade showA={items.length > 0}>
          {#snippet childrenA()}
            <div
              use:scrollHistory={listId}
              use:resetScroll={contentHash}
              use:scrollToChild={{
                index: isHorizontalScrollUnlocked ? undefined : scrollToIndex,
                key: contentHash,
              }}
              use:trackVisibleRange={onVisibleRange != null}
              onvisiblerange={(event) => onVisibleRange?.(event.detail)}
              use:unlockOnHorizontalWheel={isHorizontalScrollUnlocked}
              onhorizontalwheel={() => {
                unlockedKey = unlockKey;
                onUserScroll?.();
              }}
              use:touchScroll={onUserScroll != null}
              ontouchscroll={onUserScroll}
              data-horizontal-scroll={isHorizontalScrollUnlocked || undefined}
              class="trakt-list-item-container section-list-horizontal-scroll"
              data-dpad-navigation={DpadNavigationType.List}
              data-navigation-type={$navigation}
            >
              {#each items as i (i.key)}
                {@render item(i)}
              {/each}

              {#if trailingItem}
                {@render trailingItem()}
              {/if}

              {#if ctaItem && items.length <= ctaCutOff}
                {#key `section-list-${listId}_cta`}
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

        {@render overlay?.()}
      </div>
    {/if}
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .section-list-container {
    --shadow-spacing: var(--ni-2);

    --height-min-container: var(--ni-40);
    --section-list-height: calc(
      var(--height-override-list, var(--height-list)) + var(--shadow-spacing)
    );
    --list-inset-top-resolved: var(--list-inset-top, var(--ni-0));
    --height-container: calc(
      var(--section-list-height) + var(--ni-40) + var(--list-header-gap) +
        var(--list-inset-top-resolved)
    );

    --list-mask-offset: var(--layout-distance-side);

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

      .section-list:not(.trakt-edit-mode) {
        transition:
          height var(--transition-increment) ease-in-out,
          min-height var(--transition-increment) ease-in-out;
      }
    }

    &[data-variant="inline"] {
      --list-mask-offset: 0;
      --list-bleed-start: var(--ni-0);

      :global(.trakt-list-inset-title) {
        margin: 0;
      }

      .trakt-list-item-container {
        padding-inline: var(--inset-override-list-item, var(--ni-2));
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
    min-height: calc(
      var(--section-list-height) + var(--list-inset-top-resolved)
    );
    height: calc(var(--section-list-height) + var(--list-inset-top-resolved));

    &:not(.trakt-edit-mode) {
      transition:
        opacity var(--transition-increment) ease-in-out,
        filter var(--transition-increment) ease-in-out,
        transform var(--transition-increment) ease-in-out;
    }
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
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    transition:
      gap var(--transition-increment) ease-in-out,
      padding-top var(--transition-increment) ease-in-out;
    gap: var(--list-gap);

    padding-top: calc(
      var(--shadow-spacing) + var(--list-inset-top-resolved, var(--ni-0))
    );

    &[data-navigation-type="dpad"] {
      gap: var(--gap-xxs);
    }
  }

  .section-list-has-multiple-items.section-list-has-drilldown,
  .section-list-has-multiple-items:has(:global(.trakt-view-all-button)) {
    .section-list-horizontal-scroll {
      overflow-x: hidden;
      --list-end-fade: var(--list-mask-offset);

      @supports (-moz-appearance: none) {
        overflow-x: auto;
        --list-end-fade: var(--ni-0);
      }

      @include for-tablet-lg {
        --list-mask-offset: calc(
          var(--layout-distance-side) - var(--list-gap) * 0.5
        );
      }

      @include for-tablet-sm-and-below {
        overflow-x: auto;
      }

      @include for-touch {
        overflow-x: auto;
        --list-end-fade: var(--ni-0);
      }

      &[data-horizontal-scroll] {
        overflow-x: auto;
        --list-end-fade: var(--ni-0);
      }
    }
  }

  .section-list-horizontal-scroll {
    --list-fade-dir: to right;
    --list-bleed-fade: var(--ni-0);
    --list-end-fade: var(--ni-0);

    mask-image:
      linear-gradient(
        var(--list-fade-dir),
        rgb(0 0 0 / var(--list-bleed-alpha)) 0,
        rgb(0 0 0 / calc(var(--list-bleed-alpha) + (1 - var(--list-bleed-alpha)) * 0.156))
          calc(var(--list-bleed-fade) * 0.25),
        rgb(0 0 0 / calc(var(--list-bleed-alpha) + (1 - var(--list-bleed-alpha)) * 0.5))
          calc(var(--list-bleed-fade) * 0.5),
        rgb(0 0 0 / calc(var(--list-bleed-alpha) + (1 - var(--list-bleed-alpha)) * 0.844))
          calc(var(--list-bleed-fade) * 0.75),
        black var(--list-bleed-fade),
        black calc(100% - var(--list-end-fade)),
        transparent calc(100% - var(--list-end-fade))
      ),
      linear-gradient(black, black);
    mask-size:
      100% 100%,
      100% var(--layout-scrollbar-width);
    mask-position:
      0 0,
      0 100%;
    mask-repeat: no-repeat;

    &:dir(rtl) {
      --list-fade-dir: to left;
    }

    @include for-tablet-sm-and-below {
      mask-image: none;
    }
  }

  :global(.trakt-content) .section-list-horizontal-scroll {
    --list-bleed-fade: calc(
      var(--list-bleed-start) + min(var(--list-bleed-start), var(--ni-64))
    );

    margin-inline-start: calc(-1 * var(--list-bleed-start));
    padding-inline-start: calc(
      var(--layout-distance-side) + var(--list-bleed-start)
    );

    @supports (animation-timeline: scroll()) {
      animation: list-bleed-fade linear both;
      animation-timeline: scroll(self inline);
      animation-range: 0 var(--list-bleed-start);
    }

    &::-webkit-scrollbar-track {
      margin-left: var(--list-bleed-start);
    }

    &:dir(rtl)::-webkit-scrollbar-track {
      margin-left: 0;
      margin-right: var(--list-bleed-start);
    }
  }

  @keyframes list-bleed-fade {
    to {
      --list-bleed-alpha: 0.1;
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

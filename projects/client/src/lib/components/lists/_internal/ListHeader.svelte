<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListLabel from "../ListLabel.svelte";
  import ListDrilldownAction from "../ListDrilldownAction.svelte";
  import type { ListHeaderProps } from "./ListHeaderProps.ts";

  const {
    title,
    subtitle,
    metaInfo,
    actions,
    navigationType,
    drilldown,
    listActions,
    collapse,
    count,
    filters,
  }: ListHeaderProps = $props();

  const { isEditMode } = useEditMode();

  const viewAll = $derived(
    $isEditMode || drilldown?.mode === "disabled" ? undefined : drilldown,
  );
</script>

<div class="trakt-list-inset-title">
  <div class="list-header" class:has-filters={Boolean(filters)}>
    <div class="label-start">
      <div class="label-line">
        {#if collapse}
          <button
            type="button"
            class="label-toggle"
            aria-expanded={!collapse.isCollapsed}
            aria-label={collapse.label}
            onclick={collapse.toggle}
          >
            <ListLabel {title} {subtitle} {count} />
            <span class="label-caret" aria-hidden="true">
              <CaretRightIcon />
            </span>
          </button>
        {:else}
          <div class="label-plain">
            <ListLabel {title} {subtitle} {count} />
          </div>
        {/if}

        {#if filters && !collapse?.isCollapsed}
          <div class="list-filters">{@render filters()}</div>
        {/if}
      </div>

      {#if metaInfo}
        <div class="label-meta">{@render metaInfo()}</div>
      {/if}
    </div>

    <div class="label-end">
      {#if actions}
        <div class="list-actions" data-dpad-navigation={navigationType}>
          {@render actions()}
        </div>
      {/if}

      {#if viewAll}
        <div class="view-all">
          <ListDrilldownAction drilldown={viewAll}>
            <span class="view-all-text">{m.text_view_all()}</span>
            <CaretRightIcon />
          </ListDrilldownAction>
        </div>
      {/if}
    </div>
  </div>

  {@render listActions?.()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-inset-title {
    margin-block: 0;
    margin-inline: var(--layout-distance-side);
    transition: margin-inline-start calc(var(--transition-increment) * 2)
      ease-in-out;
  }

  .list-header {
    --list-header-row-height: var(--ni-40);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
    min-height: var(--list-header-row-height);
    user-select: none;

    /* The first line matches the filters' 44px row, so when they wrap, View
       all stays level with the label. */
    &.has-filters {
      --list-header-row-height: var(--ni-44);
    }
  }

  .label-start {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-width: 0;
  }

  /* On a narrow screen the filters wrap under the label rather than squeeze it. */
  .label-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: calc(var(--gap-s) + var(--ni-4));
    row-gap: 0;
    min-width: 0;
    max-width: 100%;
  }

  .list-filters {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
    max-width: 100%;
  }

  /* Level with the label's own line, even with a credit under the label. */
  .label-end {
    flex-shrink: 0;
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-height: var(--list-header-row-height);

    :global(.trakt-action-button) {
      --button-size: var(--ni-32);
    }
  }

  .list-actions {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;
  }

  .label-meta {
    display: flex;
    align-items: center;
    padding-block-end: var(--ni-8);
    color: var(--color-text-secondary);

    :global(.trakt-link) {
      text-decoration: none;
    }

    &:empty {
      display: none;
    }
  }

  .label-plain,
  .label-toggle {
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: var(--list-header-row-height);
  }

  .label-toggle {
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    gap: var(--gap-micro);

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-input-focus);
      outline-offset: var(--ni-2);
      border-radius: var(--border-radius-xs);
    }
  }

  /* Hidden while the list is open; a folded list always shows how to reopen it. */
  .label-caret {
    display: flex;
    color: var(--color-text-secondary);
    opacity: 0;

    /* The glyph already mirrors under RTL, so the turn to "down" flips too. */
    transform: rotate(calc(var(--rtl-sign) * 90deg));
    transition: var(--transition-increment) ease-in-out;
    transition-property: color, opacity, transform;

    :global(svg) {
      width: var(--ni-8);
      height: var(--ni-8);
    }
  }

  .label-toggle[aria-expanded="false"] .label-caret {
    opacity: 1;
    transform: none;
  }

  @include for-mouse {
    .label-toggle:hover .label-caret {
      opacity: 1;
      color: var(--color-text-primary);
    }
  }

  .view-all {
    display: flex;

    :global(.trakt-link),
    :global(.trakt-list-drilldown-action) {
      display: flex;
      align-items: center;
      gap: var(--gap-micro);
      min-height: var(--list-header-row-height);

      text-decoration: none;
      color: var(--color-text-secondary);
      transition: color var(--transition-increment) ease-in-out;
    }

    .view-all-text {
      font-size: var(--font-size-text);
      font-weight: 400;
    }

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }

    @include for-mouse {
      :global(.trakt-link:hover),
      :global(.trakt-list-drilldown-action:hover) {
        color: var(--color-text-primary);
      }
    }
  }
</style>

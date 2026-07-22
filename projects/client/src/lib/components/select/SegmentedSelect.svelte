<script lang="ts" generics="TValue extends string">
  import { goto } from "$app/navigation";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { appendGlobalParameters } from "$lib/features/parameters/appendGlobalParameters.ts";
  import type { SegmentedSelectOption } from "./models/SegmentedSelectOption.ts";
  import type { SegmentedSelectProps } from "./models/SegmentedSelectProps.ts";
  import {
    trackSelector,
    type TrackSelectorParams,
  } from "./_internal/trackSelector.ts";

  const unfoldStaggerMs = 60;

  const {
    options,
    value,
    variant = "regular",
    disabled = false,
    ariaLabel,
    icon,
    expandable = false,
    collapsedCount = 0,
    expanded = false,
    extension,
    onChange,
  }: SegmentedSelectProps<TValue> = $props();

  const selectedIndex = $derived(
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );

  const collapseFrom = $derived(
    expandable ? options.length - collapsedCount : options.length,
  );
  const isCollapsed = (index: number) => !expanded && index >= collapseFrom;

  const unfoldDelay = (index: number) => {
    if (index < collapseFrom) return "0ms";
    const step = expanded ? index - collapseFrom : options.length - 1 - index;
    return `${step * unfoldStaggerMs}ms`;
  };

  type SegmentPropsParams = {
    option: SegmentedSelectOption<TValue>;
    index: number;
    collapsed: boolean;
  };

  const segmentProps = ({ option, index, collapsed }: SegmentPropsParams) => ({
    class: [
      "segment",
      !collapsed && index === selectedIndex && "is-selected",
      collapsed && "is-collapsed",
    ],
    style: `--unfold-delay: ${unfoldDelay(index)}`,
    role: collapsed ? undefined : "radio",
    "aria-checked": collapsed ? undefined : index === selectedIndex,
    "aria-hidden": collapsed || undefined,
    "aria-label": option.label,
    tabindex: collapsed || disabled ? -1 : undefined,
    "data-dpad-navigation": collapsed ? undefined : DpadNavigationType.Item,
  });

  const navigate = (
    option: SegmentedSelectOption<TValue>,
    event: MouseEvent,
  ) => {
    event.preventDefault();
    onChange(option.value);

    const resolvedHref = (event.currentTarget as HTMLAnchorElement).href;
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(resolvedHref, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
  const isLabelHidden = $derived(variant === "compact" && Boolean(icon));

  const selectorParams = $derived<TrackSelectorParams>({
    isFluid: expandable || variant === "selected-label",
    shouldMorph: variant === "selected-label",
    value,
    expanded,
    optionCount: options.length,
  });
</script>

{#snippet segment(option: SegmentedSelectOption<TValue>, index: number)}
  {@const collapsed = isCollapsed(index)}
  {#if option.href}
    <a
      {...segmentProps({ option, index, collapsed })}
      aria-disabled={disabled ? "true" : undefined}
      href={option.href}
      use:appendGlobalParameters={option.href}
      onclick={(event) => {
        if (disabled || collapsed) {
          event.preventDefault();
          return;
        }
        navigate(option, event);
      }}
    >
      {@render body(option)}
    </a>
  {:else}
    <button
      type="button"
      {...segmentProps({ option, index, collapsed })}
      disabled={collapsed || disabled}
      onclick={() => onChange(option.value)}
    >
      {@render body(option)}
    </button>
  {/if}
{/snippet}

{#snippet body(option: SegmentedSelectOption<TValue>)}
  {#if icon}
    <span class="segment-icon">{@render icon(option)}</span>
  {/if}
  {#if variant !== "compact" || !icon}
    <span class="segment-label">
      <span class="label-text bold ellipsis capitalize">{option.label}</span>
    </span>
  {/if}
{/snippet}

<div
  class="trakt-segmented-select"
  use:trackSelector={selectorParams}
  role="radiogroup"
  aria-label={ariaLabel}
  data-variant={variant}
  data-expandable={expandable ? "true" : undefined}
  style:--segment-count={options.length}
  style:--selected-index={selectedIndex}
>
  <div class="segment-row" data-dpad-navigation={DpadNavigationType.List}>
    <div class="segment-selector" aria-hidden="true"></div>

    {#each options as option, index (option.value)}
      {#if isLabelHidden}
        <Tooltip content={option.label} variant="compact" disabled={!$isMouse}>
          {@render segment(option, index)}
        </Tooltip>
      {:else}
        {@render segment(option, index)}
      {/if}
    {/each}
  </div>

  {#if expandable && extension && expanded}
    <div class="segment-extension">
      <div class="extension-divider"></div>
      <div class="extension-content">
        {@render extension()}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-segmented-select {
    --segment-height: var(--ni-32);
    --segment-inset: var(--ni-4);
    --segment-gap: var(--ni-2);
    --track-base-radius: var(
      --segmented-select-radius,
      var(--border-radius-l)
    );
    --track-radius: var(--track-base-radius);
    --segment-radius: calc(var(--track-base-radius) - var(--segment-inset));
    --segment-font-size: var(--font-size-text);

    position: relative;
    box-sizing: border-box;
    width: fit-content;
    max-width: 100%;

    display: flex;
    flex-direction: column;

    padding: var(--segment-inset);
    border-radius: var(--track-radius);
    background-color: var(--color-segmented-track-background);
    backdrop-filter: blur(var(--ni-8));
    overflow: hidden;

    box-shadow: 0 0 0 var(--border-thickness-xs) transparent;

    transition: box-shadow var(--transition-increment) ease-in-out;

    &:has(.segment-extension :focus-within) {
      box-shadow: 0 0 0 var(--border-thickness-xs) var(--color-input-focus);

      @media (forced-colors: active) {
        outline: var(--border-thickness-xs) solid Highlight;
        outline-offset: var(--border-thickness-xs);
      }
    }

    &[data-variant="compact"] {
      --track-base-radius: var(
        --segmented-select-radius,
        var(--border-radius-m)
      );
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    .segment-row {
      position: relative;

      display: grid;
      grid-template-columns: repeat(var(--segment-count), 1fr);
      gap: var(--segment-gap);

      --selector-width: calc(
        (100% - var(--segment-gap) * (var(--segment-count) - 1)) /
          var(--segment-count)
      );
    }

    &[data-variant="compact"] .segment-row {
      grid-template-columns: repeat(
        var(--segment-count),
        var(--segment-height)
      );
    }
  }

  .segment-selector {
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    width: var(--selector-width);

    transform: translateX(
      calc(
        var(--rtl-sign, 1) * var(--selected-index) * (100% + var(--segment-gap))
      )
    );

    border-radius: var(--segment-radius);
    background: var(--color-segmented-selector-background);
    box-shadow: var(--ni-0) var(--ni-2) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 30%, transparent);

    transition: transform var(--transition-increment) ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .segment {
    all: unset;

    position: relative;
    z-index: var(--layer-raised);
    box-sizing: border-box;

    min-width: 0;
    height: var(--segment-height);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    padding-inline: var(--ni-12);
    cursor: pointer;

    color: var(--color-text-secondary);
    font-size: var(--segment-font-size);
    border-radius: var(--segment-radius);

    -webkit-tap-highlight-color: transparent;

    transition: color var(--transition-increment) ease-in-out;

    .segment-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      :global(svg) {
        display: block;
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }

    &.is-selected {
      color: var(--color-segmented-selector-foreground);
      cursor: default;
    }

    &:not(.is-selected) {
      @include for-mouse {
        &:hover {
          color: var(--color-text-primary);
        }
      }
    }

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-segmented-selector-foreground);
      outline-offset: calc(-1 * var(--ni-2));
    }

    &[disabled],
    &[aria-disabled="true"] {
      cursor: not-allowed;
      color: var(--color-foreground-button-disabled);
    }

    &[aria-disabled="true"] {
      pointer-events: none;
    }
  }

  .trakt-segmented-select[data-variant="compact"] {
    :global(.trakt-tooltip-trigger) {
      width: 100%;
      height: 100%;
    }

    :global(.trakt-tooltip-trigger .segment) {
      width: 100%;
    }
  }

  .trakt-segmented-select[data-variant="compact"] .segment {
    padding-inline: 0;
  }

  .trakt-segmented-select[data-expandable="true"],
  .trakt-segmented-select[data-variant="selected-label"] {
    --expand-duration: 360ms;
    --expand-slide: 300ms;
    --expand-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --selector-ease: cubic-bezier(0.22, 1, 0.36, 1);

    .segment-row {
      display: inline-flex;
      align-items: center;
      gap: 0;
    }

    .segment {
      flex: none;
      max-inline-size: var(--ni-160);
      white-space: nowrap;
      overflow: hidden;

      transition:
        color var(--transition-increment) ease-in-out,
        max-inline-size var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms),
        opacity var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms),
        padding-inline var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms),
        margin-inline-start var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms);
    }

    .segment + .segment {
      margin-inline-start: var(--segment-gap);
    }

    .segment.is-collapsed {
      max-inline-size: 0;
      padding-inline: 0;
      margin-inline-start: 0;
      opacity: 0;
      pointer-events: none;
    }

    .segment-selector {
      inset-inline: auto;
      left: 0;
      width: var(--selector-w, 0);
      transform: translateX(var(--selector-x, 0));
      opacity: 0;
    }

    .segment.is-selected {
      background: var(--color-segmented-selector-background);
      box-shadow: var(--ni-0) var(--ni-2) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 30%, transparent);
    }

    &:global(.is-measured) .segment-selector {
      opacity: 1;
    }

    &:global(.is-measured) .segment.is-selected {
      background: none;
      box-shadow: none;
    }

    &:global(.is-settled) .segment-selector {
      transition:
        transform var(--expand-slide) var(--selector-ease),
        width var(--expand-slide) var(--selector-ease),
        opacity var(--transition-increment) ease-in-out;
    }

    &:global(.is-tracking) .segment-selector {
      transition: opacity var(--transition-increment) ease-in-out;
    }

    @media (prefers-reduced-motion: reduce) {
      .segment,
      .segment-selector {
        transition: none;
      }
    }
  }

  .trakt-segmented-select[data-variant="selected-label"] {
    --expand-duration: 240ms;
    --expand-slide: 240ms;
    --expand-ease: cubic-bezier(0.3, 0, 0.2, 1);

    .segment {
      gap: 0;
      padding-inline: var(--ni-8);

      .segment-label {
        display: grid;
        grid-template-columns: 1fr;
        margin-inline-start: var(--gap-xs);

        transition:
          grid-template-columns var(--expand-duration) var(--expand-ease),
          margin-inline-start var(--expand-duration) var(--expand-ease),
          opacity var(--expand-duration) var(--expand-ease);

        .label-text {
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: clip;
        }
      }

      &.is-selected {
        padding-inline: var(--ni-12);
      }

      &:not(.is-selected) .segment-label {
        grid-template-columns: 0fr;
        margin-inline-start: 0;
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .segment .segment-label {
        transition: none;
      }
    }
  }

  .segment-extension {
    box-sizing: border-box;
    height: var(--segmented-select-extension-height);

    display: flex;
    flex-direction: column;
  }

  .extension-divider {
    flex-shrink: 0;
    height: var(--border-thickness-xxs);
    margin-block-start: var(--segment-inset);
    background: var(--color-segmented-track-border);
  }

  .extension-content {
    flex: 1;
    min-height: 0;

    display: flex;
    align-items: flex-end;

    padding-inline: var(--ni-8);
  }
</style>

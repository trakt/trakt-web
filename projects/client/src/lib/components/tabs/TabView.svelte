<script lang="ts">
  import { Tabs } from "bits-ui";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import type { TabViewProps } from "./models/TabViewProps";

  const { value, tabs, onChange, tabPosition = "top" }: TabViewProps = $props();

  let rail = $state<HTMLElement>();
  let underline = $state({ offset: 0, width: 0 });

  const captureRail = (node: HTMLElement) => {
    rail = node;
    return () => (rail = undefined);
  };

  /*
   * The underline hugs the active label instead of a fixed column, so its box
   * has to be measured. The offset is taken from the rail's inline-start edge
   * and replayed through --rtl-sign, keeping the slide direction-correct.
   */
  const measure = (node: HTMLElement) => {
    const triggers = node.querySelectorAll<HTMLElement>(".trakt-tab-trigger");
    const active = Array.from(triggers).find(
      (trigger) => trigger.dataset.value === value,
    );

    if (!active) {
      return;
    }

    const railBox = node.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const isRtl = getComputedStyle(node).direction === "rtl";

    underline = {
      offset: isRtl
        ? railBox.right - activeBox.right
        : activeBox.left - railBox.left,
      width: activeBox.width,
    };
  };

  $effect(() => {
    const node = rail;

    if (!node) {
      return;
    }

    measure(node);

    /*
     * Label widths move with font loading, container resizes and count
     * updates - observing the triggers covers all three.
     */
    const observer = new ResizeObserver(() => measure(node));
    observer.observe(node);
    node
      .querySelectorAll(".trakt-tab-trigger")
      .forEach((trigger) => observer.observe(trigger));

    return () => observer.disconnect();
  });
</script>

<div class="trakt-tab-view" data-tab-position={tabPosition}>
  <Tabs.Root {value} onValueChange={onChange} class="trakt-tabs-root">
    <div class="tab-rail" {@attach captureRail}>
      <Tabs.List class="trakt-tabs-list">
        {#each tabs as tab (tab.value)}
          <Tabs.Trigger class="trakt-tab-trigger" value={tab.value}>
            <span class="tab-label uppercase bold small ellipsis">
              {tab.label}
            </span>
            {#if tab.count != null}
              <span class="tab-count">
                {toHumanCount(tab.count, languageTag())}
              </span>
            {/if}
          </Tabs.Trigger>
        {/each}
      </Tabs.List>

      <div
        class="tab-underline"
        class:is-measured={underline.width > 0}
        style="--tab-underline-offset: {underline.offset}px; --tab-underline-width: {underline.width}px"
      ></div>
    </div>

    {#each tabs as tab (tab.value)}
      <Tabs.Content value={tab.value}>
        {#snippet child({ props })}
          {#if tab.value === value || tab.keepMounted}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div {...props} class="trakt-tab-content" tabindex={-1}>
              {@render tab.content()}
            </div>
          {/if}
        {/snippet}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>

<style>
  .trakt-tab-view {
    --tab-rule-thickness: var(--border-thickness-xxs);
    /*
     * The label rides close to its underline; the slack that keeps the tap
     * target at 40px is pushed to the far side of the label instead.
     */
    --tab-label-gap: var(--gap-xs);
    --tab-label-inset: var(--ni-16);

    :global(.trakt-tabs-root) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }

    .tab-rail {
      position: relative;
      border-block-end: var(--tab-rule-thickness) solid var(--color-tab-rule);
    }

    :global(.trakt-tabs-list) {
      display: flex;
      align-items: flex-end;
      gap: var(--gap-l);
    }

    :global(.trakt-tab-trigger) {
      -webkit-tap-highlight-color: transparent;

      display: flex;
      align-items: baseline;
      gap: var(--gap-xxs);

      min-width: 0;
      min-height: var(--ni-40);
      padding-block: var(--tab-label-inset) var(--tab-label-gap);
      padding-inline: 0;

      border: none;
      background: none;

      color: var(--color-tab-text);
      transition: color var(--transition-increment) ease-in-out;

      &[data-state="inactive"] {
        cursor: pointer;
      }

      &[data-state="active"],
      &:hover {
        color: var(--color-tab-active-text);
      }

      &:focus-visible {
        outline: var(--border-thickness-xxs) solid var(--color-tab-indicator);
        outline-offset: var(--ni-2);
        border-radius: var(--border-radius-xs);

        color: var(--color-tab-active-text);
      }
    }

    .tab-label {
      /* Uppercase labels need the extra tracking to stay readable. */
      letter-spacing: 0.08em;
    }

    .tab-count {
      color: var(--color-tab-count);
    }

    .tab-underline {
      position: absolute;
      inset-block-end: calc(-1 * var(--tab-rule-thickness));
      inset-inline-start: 0;

      width: var(--tab-underline-width);
      height: var(--border-thickness-xs);
      transform: translateX(
        calc(var(--rtl-sign) * var(--tab-underline-offset))
      );

      background: var(--color-tab-indicator);
      border-radius: var(--border-radius-xs);

      /* Hidden until the first measurement lands, so it never flashes at 0. */
      opacity: 0;
      pointer-events: none;

      transition:
        transform var(--transition-increment) ease-in-out,
        width var(--transition-increment) ease-in-out,
        opacity var(--transition-increment) ease-in-out;

      &.is-measured {
        opacity: 1;
      }
    }

    &[data-tab-position="bottom"] {
      :global(.trakt-tabs-root) {
        flex-direction: column-reverse;
      }

      .tab-rail {
        border-block-end: none;
        border-block-start: var(--tab-rule-thickness) solid
          var(--color-tab-rule);
      }

      .tab-underline {
        inset-block-end: auto;
        inset-block-start: calc(-1 * var(--tab-rule-thickness));
      }

      :global(.trakt-tab-trigger) {
        padding-block: var(--tab-label-gap) var(--tab-label-inset);
      }
    }
  }
</style>

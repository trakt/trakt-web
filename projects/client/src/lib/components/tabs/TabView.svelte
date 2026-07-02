<script lang="ts">
  import { Tabs } from "bits-ui";
  import { lineClamp } from "../text/lineClamp";
  import type { TabViewProps } from "./models/TabViewProps";

  const { value, tabs, onChange, tabPosition = "top" }: TabViewProps = $props();

  const activeIndex = $derived(tabs.findIndex((t) => t.value === value));
</script>

<div
  class="trakt-tab-view"
  data-tab-position={tabPosition}
  style="--tab-count: {tabs.length}; --active-index: {activeIndex}"
>
  <Tabs.Root {value} onValueChange={onChange} class="trakt-tabs-root">
    <Tabs.List class="trakt-tabs-list">
      <div class="trakt-tab-indicator"></div>
      {#each tabs as tab (tab.value)}
        <Tabs.Trigger class="trakt-tab-trigger" value={tab.value}>
          {#if tab.icon}
            <span class="trakt-tab-icon">
              {@render tab.icon()}
            </span>
          {/if}
          <span class="capitalize ellipsis" use:lineClamp={{ lines: 2 }}>
            {tab.label}
          </span>
        </Tabs.Trigger>
      {/each}
    </Tabs.List>

    {#each tabs as tab (tab.value)}
      <Tabs.Content value={tab.value}>
        {#snippet child({ props })}
          {#if tab.value === value}
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
    --tab-list-padding: var(--ni-4);
    --tab-list-gap: var(--gap-xxs);
    --tab-border-radius: var(--border-radius-m);

    :global(.trakt-tabs-root) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }

    :global(.trakt-tabs-list) {
      background-color: var(--color-tablist-background);
      padding: var(--tab-list-padding);
      border-radius: var(--tab-border-radius);

      display: grid;
      grid-template-columns: repeat(var(--tab-count), minmax(0, 1fr));
      gap: var(--tab-list-gap);

      position: relative;
    }

    .trakt-tab-indicator {
      --horizontal-padding: calc(2 * var(--tab-list-padding));
      --total-gap-size: calc((var(--tab-count) - 1) * var(--tab-list-gap));
      --available-width: calc(
        100% - var(--horizontal-padding) - var(--total-gap-size)
      );
      --tab-width: calc(var(--available-width) / var(--tab-count));

      position: absolute;
      margin-inline-start: var(--tab-list-padding);

      top: var(--tab-list-padding);
      bottom: var(--tab-list-padding);
      inset-inline-start: 0;
      width: var(--tab-width);
      transform: translateX(
        calc(
          var(--rtl-sign) * var(--active-index) * (100% + var(--tab-list-gap))
        )
      );

      background-color: var(--color-tab-background);
      border-radius: var(--tab-border-radius);

      transition: transform var(--transition-increment) ease-in-out;
      will-change: transform;
      pointer-events: none;
    }

    :global(.trakt-tab-trigger) {
      -webkit-tap-highlight-color: transparent;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--gap-xxs);

      min-height: var(--ni-40);
      position: relative;

      border: none;
      background-color: transparent;

      color: var(--color-text-primary);
      border-radius: var(--tab-border-radius);

      transition: background-color var(--transition-increment) ease-in-out;

      &[data-state="inactive"] {
        cursor: pointer;
      }

      &[data-state="active"] {
        color: var(--color-tab-active-text);
      }

      &:hover:not([data-state="active"]) {
        background-color: var(--color-tab-hover-background);
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--shade-10);
        color: var(--shade-10);
        background-color: var(--shade-700);
      }
    }

    .trakt-tab-icon {
      display: flex;
      flex-shrink: 0;

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }

    .trakt-tab-content {
      padding: 0 var(--ni-8);
    }

    &[data-tab-position="bottom"] {
      :global(.trakt-tabs-root) {
        flex-direction: column-reverse;
      }
    }
  }
</style>

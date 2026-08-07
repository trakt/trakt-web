<script lang="ts">
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  const {
    children,
    labels,
    headerContent,
    isCollapsed,
    toggle,
  }: {
    labels: { view: string; hide: string };
    headerContent?: Snippet;
    isCollapsed: boolean;
    toggle: () => void;
  } & ChildrenProps = $props();

  const label = $derived(isCollapsed ? labels.view : labels.hide);
</script>

<div
  class="trakt-collapsable-content-container"
  class:is-expanded={!isCollapsed}
>
  <button
    class="trakt-collapsable-content-button"
    aria-expanded={!isCollapsed}
    onclick={toggle}
  >
    <div class="trakt-collapsable-content-header">
      <p>{label}</p>

      {#if headerContent}
        {@render headerContent()}
      {/if}
    </div>
  </button>

  {#if !isCollapsed}
    <div
      class="trakt-collapsable-content"
      transition:slide={{ duration: 150, axis: "y" }}
    >
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .trakt-collapsable-content-container {
    display: flex;
    flex-direction: column;

    color: var(--color-foreground-red);
    background-color: var(--red-900);

    border-radius: var(--border-radius-xxl);
    border: var(--ni-2) solid var(--color-background-red);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color, border-color, border-radius;

    &.is-expanded {
      background-color: transparent;
      color: var(--color-foreground);
      border-color: var(--red-900);
      border-radius: var(--border-radius-l);

      .trakt-collapsable-content-header {
        :global(svg) {
          transform: rotate(180deg);
        }
      }
    }
  }

  .trakt-collapsable-content-button {
    all: unset;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    justify-content: center;

    padding: var(--ni-8);
    padding-inline-start: var(--ni-12);

    background-color: transparent;

    border-radius: inherit;

    .trakt-collapsable-content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;

      min-height: var(--ni-16);

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
        transition: transform var(--transition-increment) ease-in-out;
      }
    }
  }

  .trakt-collapsable-content {
    padding-block: 0 var(--ni-12);
    padding-inline: var(--ni-18) var(--ni-12);
  }
</style>

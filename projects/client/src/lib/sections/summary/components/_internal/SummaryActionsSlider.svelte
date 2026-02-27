<script lang="ts">
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { fade, slide } from "svelte/transition";

  const {
    children,
    isOpen,
    onOpenChange,
    transitionDuration,
  }: ChildrenProps & {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    transitionDuration: number;
  } = $props();

  const halfDuration = $derived(transitionDuration / 2);
</script>

{#if isOpen}
  <div class="trakt-summary-actions-underlay"></div>

  <div
    class="trakt-summary-actions-slider"
    in:slide={{ duration: transitionDuration, delay: halfDuration }}
    out:slide={{ duration: transitionDuration }}
    use:clickOutside
    onclickoutside={() => onOpenChange(false)}
  >
    <div
      class="trakt-summary-actions"
      in:fade={{ duration: transitionDuration, delay: halfDuration }}
      out:fade={{ duration: transitionDuration }}
    >
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .trakt-summary-actions-underlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    z-index: calc(var(--layer-menu) - 1);
  }

  .trakt-summary-actions-slider {
    z-index: var(--layer-menu);

    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;

    box-shadow: var(--shadow-raised);
    clip-path: inset(0 -100vmax -100vmax -100vmax);

    background: var(--color-actions-bar-background);
    border-bottom-left-radius: var(--border-radius-l);
    border-bottom-right-radius: var(--border-radius-l);

    padding: var(--ni-12);
    box-sizing: border-box;
  }

  .trakt-summary-actions {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>

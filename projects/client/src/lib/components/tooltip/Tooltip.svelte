<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { Tooltip } from "flowbite-svelte";

  const { children, content }: { content: string } & ChildrenProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
  const trigger = $derived(isMouse ? "hover" : "click");
</script>

<!-- The tooltip needs to be adjacent to the children -->
{@render children()}
<Tooltip {trigger} class="trakt-tooltip" arrowClass="trakt-tooltip-arrow">
  <p class="smaller">{content}</p>
</Tooltip>

<style>
  :global(.trakt-tooltip) {
    all: unset;

    z-index: var(--layer-overlay);
    max-width: var(--ni-276);

    background-color: var(--color-tooltip-background);
    color: var(--color-tooltip-text);

    border-radius: var(--border-radius-s);
    padding: var(--ni-10);
  }

  :global(.trakt-tooltip-arrow.clip) {
    width: var(--ni-12);
    height: var(--ni-12);

    background: var(--color-tooltip-background);

    transform: rotate(-45deg);
    clip-path: none;
  }
</style>

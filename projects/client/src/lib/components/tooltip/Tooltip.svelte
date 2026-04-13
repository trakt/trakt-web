<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { Tooltip } from "bits-ui";
  import type { TooltipProps } from "./TooltipProps";

  const {
    children,
    content,
    variant = "default",
    side = "top",
    delayDuration = 150,
    sideOffset = 8,
    disabled = false,
  }: TooltipProps & ChildrenProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  let open = $state(false);

  const tooltipClass = $derived(
    variant === "compact" ? "trakt-tooltip-compact" : "trakt-tooltip",
  );

  const arrowClass = $derived(
    variant === "compact" ? "trakt-tooltip-compact-arrow" : undefined,
  );
</script>

<Tooltip.Provider>
  <Tooltip.Root {delayDuration} bind:open disabled={disabled ?? false}>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <div
          {...props}
          class="trakt-tooltip-trigger"
          onclick={!$isMouse ? () => (open = !open) : undefined}
        >
          {@render children()}
        </div>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content class={tooltipClass} {side} {sideOffset}>
        {#if arrowClass}
          <Tooltip.Arrow class={arrowClass} />
        {/if}
        {#if variant === "default"}
          <p>{content}</p>
        {:else}
          {content}
        {/if}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

<style>
  .trakt-tooltip-trigger {
    display: flex;
  }

  :global(.trakt-tooltip) {
    z-index: var(--layer-top);
    max-width: var(--ni-276);

    background-color: var(--color-tooltip-background);
    color: var(--color-tooltip-text);

    border-radius: var(--border-radius-s);
    padding: var(--ni-10);

    box-shadow: var(--shadow-menu);
  }

  :global(.trakt-tooltip-compact) {
    z-index: var(--layer-top);

    white-space: nowrap;

    background-color: var(--color-tooltip-background);
    color: var(--color-tooltip-text);

    font-size: var(--ni-12);
    line-height: 1;
    font-weight: 500;

    border-radius: var(--border-radius-xs);
    padding: var(--ni-6) var(--ni-8);
    margin-left: var(--ni-neg-7);

    box-shadow: var(--shadow-menu);
  }

  :global(.trakt-tooltip-compact-arrow) {
    color: var(--color-tooltip-background);
  }
</style>

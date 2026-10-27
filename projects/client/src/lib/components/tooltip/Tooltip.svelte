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
    disableHoverableContent = false,
    openOnTap = false,
  }: TooltipProps & ChildrenProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  let open = $state(false);

  const isTapToggle = $derived(openOnTap && !disabled && !$isMouse);

  const tooltipClass = $derived(
    variant === "compact" ? "trakt-tooltip-compact" : "trakt-tooltip",
  );
</script>

<Tooltip.Provider>
  <Tooltip.Root
    {delayDuration}
    bind:open
    disabled={disabled ?? false}
    {disableHoverableContent}
    ignoreNonKeyboardFocus
  >
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <div
          {...props}
          class="trakt-tooltip-trigger"
          onclick={isTapToggle ? () => (open = !open) : undefined}
        >
          {@render children()}
        </div>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content class={tooltipClass} {side} {sideOffset}>
        {#if typeof content === "function"}
          {@render content()}
        {:else if variant === "default"}
          <p>{content}</p>
        {:else}
          {content}
        {/if}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-tooltip-trigger {
    display: flex;
  }

  :global(.trakt-tooltip) {
    z-index: var(--layer-top);
    max-width: var(--ni-276);

    color: var(--color-text-primary);

    padding: var(--ni-10) var(--ni-12);

    @include floating-surface($radius: var(--border-radius-menu-item));
  }

  :global(.trakt-tooltip-compact) {
    z-index: var(--layer-top);

    white-space: nowrap;

    color: var(--color-text-primary);

    font-size: var(--ni-12);
    line-height: 1;
    font-weight: 500;

    padding: var(--ni-6) var(--ni-8);

    @include floating-surface($radius: var(--border-radius-s));
  }
</style>

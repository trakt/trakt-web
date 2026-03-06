<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { Tooltip } from "bits-ui";

  const { children, content }: { content: string } & ChildrenProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  let open = $state(false);
</script>

<Tooltip.Provider>
  <Tooltip.Root delayDuration={150} bind:open>
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
      <Tooltip.Content class="trakt-tooltip" sideOffset={8}>
        <p>{content}</p>
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

<style>
  .trakt-tooltip-trigger {
    display: flex;
  }

  :global(.trakt-tooltip) {
    z-index: var(--layer-overlay);
    max-width: var(--ni-276);

    background-color: var(--color-tooltip-background);
    color: var(--color-tooltip-text);

    border-radius: var(--border-radius-s);
    padding: var(--ni-10);

    box-shadow: var(--shadow-menu);
  }
</style>

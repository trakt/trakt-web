<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";
  import { scale } from "svelte/transition";

  type PopoverProps = {
    content: Snippet;
    label?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  } & (
    | { customAnchor: HTMLElement; children?: never }
    | { children: Snippet; customAnchor?: never }
  );

  const { content, label, open, onOpenChange, ...rest }: PopoverProps =
    $props();

  const isControlled = $derived(open !== undefined);

  let internalOpen = $state(false);
  let hasOpened = $state(false);

  const getOpen = () => open ?? internalOpen;
  const setOpen = (value: boolean) => {
    if (value) hasOpened = true;
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      internalOpen = value;
    }
  };

  $effect(() => {
    if (open) hasOpened = true;
  });
</script>

<Popover.Root bind:open={getOpen, setOpen}>
  {#if rest.children}
    <Popover.Trigger class="trakt-popover-trigger" aria-label={label}>
      {@render rest.children()}
    </Popover.Trigger>
  {/if}
  {#if hasOpened || getOpen()}
    <Popover.Portal>
      <Popover.Content
        forceMount
        sideOffset={8}
        side="top"
        customAnchor={rest.customAnchor}
      >
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div
                {...props}
                class="trakt-popover-content"
                style="z-index: var(--layer-top)"
                in:scale|global={{ duration: 250 }}
                out:scale={{ duration: 250 }}
              >
                {@render content()}
              </div>
            </div>
          {/if}
        {/snippet}
      </Popover.Content>
    </Popover.Portal>
  {/if}
</Popover.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-popover-content {
    padding: var(--ni-16);

    @include floating-surface;
  }

  :global(.trakt-popover-trigger) {
    all: unset;
    display: inline-flex;
  }

  :global(.trakt-popover-trigger:focus-visible) {
    outline: var(--border-thickness-xs) solid var(--color-foreground);
    outline-offset: var(--ni-2);
    border-radius: var(--border-radius-m);
  }
</style>

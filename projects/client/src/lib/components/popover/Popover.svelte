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

  const getOpen = () => (isControlled ? open! : internalOpen);
  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      internalOpen = value;
    }
  };
</script>

<Popover.Root bind:open={getOpen, setOpen}>
  {#if rest.children}
    <Popover.Trigger class="trakt-popover-trigger" aria-label={label}>
      {@render rest.children()}
    </Popover.Trigger>
  {/if}
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
              style="z-index: var(--layer-top)"
              transition:scale={{ duration: 250 }}
            >
              {@render content()}
            </div>
          </div>
        {/if}
      {/snippet}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  :global(.trakt-popover-trigger) {
    all: unset;
    display: inline-flex;
  }

  /* `all: unset` above strips the UA focus ring, so put one back. */
  :global(.trakt-popover-trigger:focus-visible) {
    outline: var(--border-thickness-xs) solid var(--color-foreground);
    outline-offset: var(--ni-2);
    border-radius: var(--border-radius-m);
  }
</style>

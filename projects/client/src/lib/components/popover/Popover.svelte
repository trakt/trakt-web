<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";

  type PopoverProps = {
    content: Snippet;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  } & (
    | { customAnchor: HTMLElement; children?: never }
    | { children: Snippet; customAnchor?: never }
  );

  const { content, open, onOpenChange, ...rest }: PopoverProps = $props();

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
    <Popover.Trigger class="trakt-popover-trigger">
      {@render rest.children()}
    </Popover.Trigger>
  {/if}
  <Popover.Portal>
    <Popover.Content
      sideOffset={8}
      side="top"
      style="z-index: var(--layer-top)"
      customAnchor={rest.customAnchor}
    >
      {@render content()}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  :global(.trakt-popover-trigger) {
    all: unset;
    display: inline-flex;
  }
</style>

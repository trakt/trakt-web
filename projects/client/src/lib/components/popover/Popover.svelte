<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";

  type PopoverProps = {
    content: Snippet;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  } & ChildrenProps;

  const { children, content, open, onOpenChange }: PopoverProps = $props();

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
  <Popover.Trigger class="trakt-popover-trigger">
    {@render children()}
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content sideOffset={8} side="top">
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

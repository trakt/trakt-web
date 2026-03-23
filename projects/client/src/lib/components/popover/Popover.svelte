<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";

  const { children, content }: { content: Snippet } & ChildrenProps = $props();
</script>

<Popover.Root>
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

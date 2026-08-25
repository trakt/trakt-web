<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { fade } from "svelte/transition";

  const {
    classList,
    onClose,
    children,
  }: {
    classList: string;
    onClose: () => void;
  } & ChildrenProps = $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  size="large"
  {classList}
  onOpened={() => (isOpen = true)}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      {@render children()}
    </div>
  {/if}
</Drawer>

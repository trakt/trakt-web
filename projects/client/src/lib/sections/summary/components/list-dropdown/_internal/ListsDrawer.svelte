<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";

  const { children, onClose }: { onClose: () => void } & ChildrenProps =
    $props();
</script>

<Drawer {onClose}>
  <ul>
    {@render children()}
  </ul>
</Drawer>

<style>
  ul {
    all: unset;

    display: grid;
    grid-template-columns: 100%;

    gap: var(--gap-xxs);
  }
</style>

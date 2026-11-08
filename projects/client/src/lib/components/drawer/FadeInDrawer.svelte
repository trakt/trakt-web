<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { fade } from "svelte/transition";
  import type { FadeInDrawerProps } from "./FadeInDrawerProps.ts";

  const { children, ...rest }: FadeInDrawerProps = $props();

  let isOpen = $state(false);
</script>

<Drawer {...rest} onOpened={() => (isOpen = true)}>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      {@render children()}
    </div>
  {/if}
</Drawer>

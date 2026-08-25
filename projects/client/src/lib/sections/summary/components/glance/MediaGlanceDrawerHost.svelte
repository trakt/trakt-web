<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { fade } from "svelte/transition";
  import MediaGlance from "./_internal/MediaGlance.svelte";
  import type { MediaGlanceTarget } from "./MediaGlanceTarget.ts";

  const {
    onClose,
    ...target
  }: { onClose: () => void } & MediaGlanceTarget = $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  size="large"
  classList="trakt-media-glance-drawer"
  onOpened={() => (isOpen = true)}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <MediaGlance {...target} />
    </div>
  {/if}
</Drawer>

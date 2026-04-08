<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fade } from "svelte/transition";
  import MediaDetails from "./_internal/MediaDetails.svelte";
  import MediaLinks from "./_internal/MediaLinks.svelte";
  import MediaStats from "./_internal/MediaStats.svelte";
  import type { MediaDetailsProps } from "./MediaDetailsProps";

  const { onClose, ...props }: { onClose: () => void } & MediaDetailsProps =
    $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_details()}
  size="auto"
>
  {#if isOpen}
    <div
      class="trakt-details-drawer-content"
      transition:fade={{ duration: 150 }}
    >
      <MediaStats {...props} />
      <MediaDetails {...props} />

      {#if props.type !== "episode"}
        <MediaLinks media={props.media} />
      {/if}
    </div>
  {/if}
</Drawer>

<style>
  .trakt-details-drawer-content {
    --details-gap: var(--gap-l);

    display: flex;
    flex-direction: column;
    gap: var(--details-gap);
  }
</style>

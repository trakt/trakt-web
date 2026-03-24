<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { fade } from "svelte/transition";
  import MediaDetails from "./_internal/MediaDetails.svelte";
  import MediaStats from "./_internal/MediaStats.svelte";
  import MediaWatchHistory from "./_internal/MediaWatchHistory.svelte";
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

      <RenderFor audience="authenticated">
        <MediaWatchHistory {...props} />
      </RenderFor>
    </div>
  {/if}
</Drawer>

<style>
  .trakt-details-drawer-content {
    --details-gap: var(--gap-l);

    display: flex;
    flex-direction: column;
    gap: var(--details-gap);

    :global(> *:not(:last-child)) {
      padding-bottom: var(--details-gap);
      border-bottom: 1px solid var(--color-border);
    }
  }
</style>

<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import VideoItem from "$lib/sections/lists/components/VideoItem.svelte";
  import { fade } from "svelte/transition";

  const {
    onClose,
    videos,
    slug,
  }: {
    videos: MediaVideo[];
    slug: string;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_extras()}
  size="large"
>
  {#if isOpen}
    <div class="video-drawer-content" transition:fade={{ duration: 150 }}>
      <GridList
        id={`video-drawer-${slug}`}
        items={videos}
        --width-item="var(--width-landscape-card)"
      >
        {#snippet item(video)}
          <VideoItem {video} {slug} />
        {/snippet}
      </GridList>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .video-drawer-content {
    display: contents;
  }
</style>

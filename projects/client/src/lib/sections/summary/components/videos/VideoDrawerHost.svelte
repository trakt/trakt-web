<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import VideoItem from "$lib/sections/lists/components/VideoItem.svelte";
  import VideoTypeDropdown from "$lib/sections/lists/components/VideoTypeDropdown.svelte";
  import { useVideoTypes } from "$lib/sections/lists/utils/useVideoTypes";
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

  const { record, types, active } = $derived(useVideoTypes(videos));
  const items = $derived(record[$active] ?? []);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_extras()}
  size="large"
>
  {#snippet badge()}
    <VideoTypeDropdown
      {types}
      active={$active}
      onchange={(type) => active.set(type)}
    />
  {/snippet}

  {#if isOpen}
    <div class="video-drawer-content" transition:fade={{ duration: 150 }}>
      <GridList
        id={`video-drawer-${slug}`}
        {items}
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
  @use "$style/scss/mixins/index" as *;

  .video-drawer-content {
    display: contents;

    --container-width: calc(var(--drawer-size) - 2 * var(--drawer-padding));
    --width-override-card: calc(
      (var(--container-width) - 2 * var(--list-gap)) / 2
    );
    --height-override-card-cover: calc(var(--width-override-card) / 1.786);
    --height-override-card: calc(
      var(--height-override-card-cover) + var(--height-card-footer)
    );

    @include for-mobile {
      --container-width: calc(100dvw - 2 * var(--drawer-padding));
    }

    :global(.trakt-list-item-container) {
      padding: 0;
    }

    :global(.trakt-list-items) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

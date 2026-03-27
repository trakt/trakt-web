<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import { useRelatedList } from "$lib/sections/lists/stores/useRelatedList";
  import { DEFAULT_RELATED_LIMIT } from "$lib/utils/constants";
  import { fade } from "svelte/transition";

  const {
    onClose,
    slug,
    type,
  }: {
    slug: string;
    type: MediaType;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);

  const title = $derived(
    type === "movie"
      ? m.list_title_related_movies()
      : m.list_title_related_shows(),
  );

  const { list } = $derived(
    useRelatedList({ type, slug, limit: DEFAULT_RELATED_LIMIT }),
  );
</script>

<Drawer {onClose} onOpened={() => (isOpen = true)} {title} size="large">
  {#if isOpen}
    <div class="related-drawer-content" transition:fade={{ duration: 150 }}>
      <GridList id={`related-drawer-${type}-${slug}`} items={$list}>
        {#snippet item(media)}
          <DefaultMediaItem {type} {media} source="related" canDeemphasize />
        {/snippet}
      </GridList>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .related-drawer-content {
    display: contents;
  }
</style>

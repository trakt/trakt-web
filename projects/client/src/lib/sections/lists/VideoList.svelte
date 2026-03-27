<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import VideoItem from "./components/VideoItem.svelte";
  import VideoTypeDropdown from "./components/VideoTypeDropdown.svelte";
  import ViewAllButton from "./components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";
  import { useVideoTypes } from "./utils/useVideoTypes";

  type VideoListProps = {
    slug: string;
    videos: MediaVideo[];
    drilldownLink?: string;
  };

  const { slug, videos, drilldownLink }: VideoListProps = $props();

  const { record, types, active } = $derived(useVideoTypes(videos));
  const items = $derived(record[$active] ?? []);
</script>

{#if videos.length > 0}
  <SectionList
    id={`video-list-${slug}`}
    {items}
    title={m.list_title_extras()}
    {drilldownLink}
    noscroll={drilldownLink != null}
    --height-list={mediaListHeightResolver("landscape")}
    headerNavigationType={DpadNavigationType.List}
  >
    {#snippet item(video)}
      <VideoItem {video} {slug} />
    {/snippet}

    {#snippet actions()}
      <VideoTypeDropdown
        {types}
        active={$active}
        onchange={(type) => active.set(type)}
      />

      {#if drilldownLink}
        <ViewAllButton
          href={drilldownLink}
          label={m.button_text_view_all()}
          noscroll
          source={{ id: "videos" }}
          disabled={videos.length === 0}
        />
      {/if}
    {/snippet}
  </SectionList>
{/if}

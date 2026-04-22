<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import {
    summaryDrawerNavigation,
    SummaryDrawers,
  } from "../summary/_internal/summaryDrawerNavigation";
  import VideoItem from "./components/VideoItem.svelte";
  import VideoTypeDropdown from "./components/VideoTypeDropdown.svelte";
  import ViewAllButton from "./components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";
  import { useVideoTypes } from "./utils/useVideoTypes";

  type VideoListProps = {
    slug: string;
    videos: MediaVideo[];
  };

  const { slug, videos }: VideoListProps = $props();

  const { record, types, active } = $derived(useVideoTypes(videos));
  const items = $derived(record[$active] ?? []);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const videosDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Videos));
</script>

{#if videos.length > 0}
  <SectionList
    id={`video-list-${slug}`}
    {items}
    title={m.list_title_extras()}
    drilldownLink={videosDrawerLink.href}
    noscroll={videosDrawerLink.noscroll}
    replacestate={videosDrawerLink.replacestate}
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

      <ViewAllButton
        {...videosDrawerLink}
        label={m.button_text_view_all()}
        source={{ id: "videos" }}
        disabled={videos.length === 0}
      />
    {/snippet}
  </SectionList>
{/if}

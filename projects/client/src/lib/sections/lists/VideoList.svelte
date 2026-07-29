<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import TogglePills from "$lib/components/toggles/TogglePills.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import { toTranslatedVideoType } from "$lib/utils/formatting/string/toTranslatedVideoType";
  import {
    summaryDrawerNavigation,
    SummaryDrawers,
  } from "../summary/_internal/summaryDrawerNavigation";
  import VideoItem from "./components/VideoItem.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";
  import { useVideoTypes } from "./utils/useVideoTypes";

  type VideoListProps = {
    slug: string;
    videos: MediaVideo[];
    type: MediaType;
  };

  const { slug, videos, type }: VideoListProps = $props();

  const { record, types, active } = $derived(useVideoTypes(videos));
  const items = $derived(record[$active] ?? []);

  const hasMultipleTypes = $derived(types.length > 1);

  const pillOptions = $derived(
    types.map((videoType) => ({
      value: videoType,
      text: () => toTranslatedVideoType(videoType),
      label: () => toTranslatedVideoType(videoType),
    })),
  );

  const { buildDrawerLink } = summaryDrawerNavigation();
  const videosDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Videos));
</script>

{#snippet subHeader()}
  <TogglePills
    value={$active}
    onChange={(videoType) => active.set(videoType)}
    options={pillOptions}
  />
{/snippet}

{#if videos.length > 0}
  <SectionList
    id={{
      scope: `video-list-${type}`,
      key: slug,
    }}
    {items}
    title={m.list_title_extras()}
    drilldown={{
      ...videosDrawerLink,
      source: { id: "videos" },
      label: m.button_text_view_all(),
    }}
    --height-list={mediaListHeightResolver("landscape")}
    headerNavigationType={DpadNavigationType.List}
    subHeader={hasMultipleTypes ? subHeader : undefined}
  >
    {#snippet item(video)}
      <VideoItem {video} {slug} />
    {/snippet}
  </SectionList>
{/if}

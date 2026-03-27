<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { toTranslatedVideoType } from "$lib/utils/formatting/string/toTranslatedVideoType";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import VideoItem from "./components/VideoItem.svelte";
  import ViewAllButton from "./components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type VideoListProps = {
    slug: string;
    videos: MediaVideo[];
    drilldownLink?: string;
  };

  const { slug, videos, drilldownLink }: VideoListProps = $props();

  const { record, types } = $derived.by(() => {
    if (!videos.length) return { record: {}, types: [] };

    const record = videos.reduce(
      (acc, video) => {
        acc[video.type] = acc[video.type] || [];
        acc[video.type].push(video);
        return acc;
      },
      {} as Record<string, MediaVideo[]>,
    );

    const types = Object.keys(record) as Array<MediaVideo["type"]>;

    return { record, types };
  });

  const firstType = $derived(
    assertDefined(types.at(0), "VideoList: No video types found"),
  );
  const active = $derived(writable(firstType));
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
      {#if types.length > 1}
        <DropdownList
          preferNative
          label={m.dropdown_label_extras()}
          style="flat"
          variant="primary"
          color="blue"
          size="small"
          navigationType={DpadNavigationType.Item}
        >
          {toTranslatedVideoType($active)}
          {#snippet items()}
            {#each types as type}
              <DropdownItem color="blue" onclick={() => active.set(type)}>
                {toTranslatedVideoType(type)}
              </DropdownItem>
            {/each}
          {/snippet}
        </DropdownList>
      {/if}

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

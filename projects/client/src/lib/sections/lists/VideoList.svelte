<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import ShadowList from "$lib/components/lists/section-list/ShadowList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { writable } from "svelte/store";
  import VideoItem from "./components/VideoItem.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type VideoListProps = {
    slug: string;
    videos: MediaVideo[];
  };

  const { slug, videos }: VideoListProps = $props();

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

  const firstType = $derived(types.at(0));
  const active = $derived(writable(firstType));
  const items = $derived(record[$active] ?? []);
</script>

{#if videos.length > 0}
  <ShadowList
    id={`video-list-${slug}`}
    {items}
    title={m.list_title_extras()}
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
          text="capitalize"
          size="small"
          navigationType={DpadNavigationType.Item}
        >
          {toTranslatedValue("video_type", $active)}
          {#snippet items()}
            {#each types as type}
              <DropdownItem color="blue" onclick={() => active.set(type)}>
                {toTranslatedValue("video_type", type)}
              </DropdownItem>
            {/each}
          {/snippet}
        </DropdownList>
      {/if}
    {/snippet}
  </ShadowList>
{/if}

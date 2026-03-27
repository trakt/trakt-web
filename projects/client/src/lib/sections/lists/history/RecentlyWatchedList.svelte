<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { m } from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    slug: string;
    mode: DiscoverMode;
  };

  const { title, slug, mode }: RecentlyWatchedListProps = $props();
</script>

<DrillableMediaList
  {title}
  id={`recently-watched-list-${slug}-${mode}`}
  type={mode}
  useList={({ limit }: { limit: number }) =>
    useRecentlyWatchedList({
      type: mode,
      limit,
      slug,
    })}
  variant="landscape"
  drilldownLabel={m.button_label_view_all_history()}
  source={{ id: "recently-watched" }}
  urlBuilder={() => UrlBuilder.profile.history(slug)}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} />
  {/snippet}
</DrillableMediaList>

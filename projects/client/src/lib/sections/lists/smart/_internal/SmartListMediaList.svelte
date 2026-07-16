<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import { smartListItemsQuery } from "$lib/requests/queries/smart-lists/smartListItemsQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import DefaultMediaItem from "../../components/DefaultMediaItem.svelte";
  import DrillableMediaList from "../../drilldown/DrillableMediaList.svelte";
  import { usePaginatedListQuery } from "../../stores/usePaginatedListQuery";
  import { toDiscoverMode } from "./toDiscoverMode";

  type SmartListMediaListProps = {
    list: SmartList;
    actions?: Snippet;
    scope?: string;
  };

  const { list, actions, scope }: SmartListMediaListProps = $props();

  const type = $derived(toDiscoverMode(list.mediaType));

  const useList = (params: { limit: number }) =>
    usePaginatedListQuery(
      smartListItemsQuery({ slug: list.slug, limit: params.limit }),
    );
</script>

<DrillableMediaList
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
  id={{
    scope: scope ?? "smart-list",
    key: list.slug,
  }}
  source={{ id: "smart-list", type }}
  {type}
  title={list.title}
  drilldownLabel={m.button_label_view_all_items_in({ title: list.title })}
  {actions}
  {useList}
  urlBuilder={() => UrlBuilder.lists.smart.view(list.slug)}
>
  {#snippet item(media)}
    <DefaultMediaItem
      type={media.type}
      {media}
      source="smart-list"
      mode={type === "media" ? "mixed" : "standalone"}
      canDeemphasize
    />
  {/snippet}
</DrillableMediaList>

<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    type: DiscoverMode;
    actions?: Snippet;
    search?: Record<string, string>;
  };

  const {
    title,
    type,
    actions: externalActions,
    search,
  }: PopularListProps = $props();
  const { filterMap } = useFilter();
</script>

{#snippet actions()}
  {#if externalActions}
    {@render externalActions()}
  {:else}
    <ShareButton
      {title}
      textFactory={({ title: name }) => m.text_share_top_list({ name })}
      source={{ id: "popular", type }}
    />
  {/if}
{/snippet}

<DrilledMediaList
  id="view-all-popular-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    usePopularList({
      ...params,
      search,
    })}
  {actions}
>
  {#snippet item(media)}
    <PopularListItem
      type={media.type}
      {media}
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>

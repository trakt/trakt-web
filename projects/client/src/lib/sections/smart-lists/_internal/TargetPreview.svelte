<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import type { SmartListFilters } from "$lib/requests/models/SmartListFilters";
  import { smartListPreviewQuery } from "$lib/requests/queries/smart-lists/smartListPreviewQuery";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import NoFilterResultsPlaceholder from "$lib/sections/lists/drilldown/NoFilterResultsPlaceholder.svelte";
  import { toSmartListSourceLabel } from "$lib/sections/lists/smart/toSmartListSourceLabel";
  import { usePaginatedListQuery } from "$lib/sections/lists/stores/usePaginatedListQuery";
  import type { ListTarget } from "../models/ListTarget";
  import { toSmartListFilterParams } from "../toSmartListFilterParams";
  import { toSmartListMediaType } from "../toSmartListMediaType";

  type TargetPreviewProps = {
    target: ListTarget;
    type: DiscoverMode;
    filters: SmartListFilters;
  };

  const { target, type, filters }: TargetPreviewProps = $props();

  const TYPED_TITLES: Partial<
    Record<ListTarget, Record<"movie" | "show", () => string>>
  > = {
    trending: {
      movie: m.list_title_trending_movies,
      show: m.list_title_trending_shows,
    },
    anticipated: {
      movie: m.list_title_anticipated_movies,
      show: m.list_title_anticipated_shows,
    },
    popular: {
      movie: m.list_title_popular_movies,
      show: m.list_title_popular_shows,
    },
    recommendations: {
      movie: m.list_title_recommended_movies,
      show: m.list_title_recommended_shows,
    },
    watchlist: {
      movie: m.list_title_watchlist_movies,
      show: m.list_title_watchlist_shows,
    },
  };

  const title = $derived.by(() => {
    const typed = TYPED_TITLES[target];

    if (!typed || type === "media") {
      return toSmartListSourceLabel(target);
    }

    return typed[type]();
  });
</script>

{#snippet actions()}
  <StemTag>
    <span class="tag secondary preview-tag"
      >{m.tag_text_smart_list_preview()}</span
    >
  </StemTag>
{/snippet}

<DrilledMediaList
  id={`smart-list-preview-${target}-${type}`}
  {title}
  {type}
  {actions}
  useList={(params) =>
    usePaginatedListQuery(
      smartListPreviewQuery({
        source: target,
        mediaType: toSmartListMediaType(type),
        filters: toSmartListFilterParams(filters),
        limit: params.limit,
      }),
    )}
>
  {#snippet empty()}
    <NoFilterResultsPlaceholder />
  {/snippet}

  {#snippet item(media)}
    <DefaultMediaItem
      type={media.type}
      {media}
      source="smart-list"
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
      canDeemphasize
    />
  {/snippet}
</DrilledMediaList>

<style>
  .preview-tag {
    color: var(--shade-10);
  }
</style>

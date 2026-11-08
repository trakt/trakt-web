<script lang="ts" generics="T extends { key: string; type: MediaType }">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { FilterParams } from "$lib/requests/models/FilterParams";
  import type { SearchParams } from "$lib/requests/models/SearchParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Observable } from "rxjs";
  import type { Snippet } from "svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import type { DiscoverListName } from "./DiscoverListName";
  import type { DiscoverListProps } from "./DiscoverListProps";

  type Props = DiscoverListProps & {
    name: DiscoverListName;
    useList: (
      params: { type: DiscoverMode; limit: number } & FilterParams &
        SearchParams,
    ) => { list: Observable<T[]>; isLoading: Observable<boolean> };
    listItem: Snippet<[T, "mixed" | "standalone"]>;
  };

  const {
    title,
    drilldownLabel,
    type,
    search,
    theme,
    actions,
    urlBuilder,
    scope,
    name,
    useList,
    listItem,
  }: Props = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
  id={{
    scope: scope ?? `${name}-list`,
    key: type,
  }}
  source={{ id: name, type }}
  {title}
  {drilldownLabel}
  {type}
  filter={theme ? undefined : $filterMap}
  {theme}
  {actions}
  useList={(params) =>
    useList({
      ...params,
      search,
    })}
  urlBuilder={urlBuilder ??
    (() =>
      UrlBuilder[name]({
        search,
      }))}
>
  {#snippet item(media)}
    {@render listItem(media, type === "media" ? "mixed" : "standalone")}
  {/snippet}
</DrillableMediaList>
